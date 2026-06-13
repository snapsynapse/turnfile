#!/usr/bin/env bash
# package.sh — Build derived skill bundle copies for strict platforms or registry publish.
# Zero dependencies beyond bash, shasum or sha256sum, awk, and standard file utilities.
#
# Usage:
#   ./package.sh strict [output-parent]
#   ./package.sh clawhub [output-parent]
#   ./package.sh all [output-parent]
#
# The script writes a directory named after the bundle beneath output-parent.
# Examples:
#   ./package.sh strict ../build/strict
#   ./package.sh clawhub ../build/clawhub
#   ./package.sh all ../build

export LC_ALL=C
export LANG=C

set -euo pipefail

MODE="${1:-}"
OUTPUT_PARENT="${2:-}"

BUNDLE_DIR="$(cd "$(dirname "$0")" && pwd)"
BUNDLE_NAME="$(basename "$BUNDLE_DIR")"
MANIFEST="$BUNDLE_DIR/MANIFEST.yaml"

usage() {
  cat <<'EOF'
Usage:
  ./package.sh strict [output-parent]
  ./package.sh clawhub [output-parent]
  ./package.sh all [output-parent]

Modes:
  strict   Build a minimal-frontmatter install copy for strict loaders.
  clawhub  Build a consumer package for ClawHub upload.
  all      Build both variants under one parent directory.
EOF
}

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

if [ -z "$MODE" ] || [ "$MODE" = "--help" ] || [ "$MODE" = "-h" ]; then
  usage
  exit 0
fi

case "$MODE" in
  strict)
    OUTPUT_PARENT="${OUTPUT_PARENT:-$BUNDLE_DIR/../build/strict}"
    ;;
  clawhub)
    OUTPUT_PARENT="${OUTPUT_PARENT:-$BUNDLE_DIR/../build/clawhub}"
    ;;
  all)
    OUTPUT_PARENT="${OUTPUT_PARENT:-$BUNDLE_DIR/../build}"
    ;;
  *)
    fail "unknown mode: $MODE"
    ;;
esac

if [ ! -f "$MANIFEST" ]; then
  fail "MANIFEST.yaml not found in $BUNDLE_DIR"
fi

if command -v shasum >/dev/null 2>&1; then
  sha256_hash() { shasum -a 256 "$1" | awk '{print $1}'; }
elif command -v sha256sum >/dev/null 2>&1; then
  sha256_hash() { sha256sum "$1" | awk '{print $1}'; }
else
  fail "neither shasum nor sha256sum found"
fi

validate_source_bundle() {
  if [ ! -x "$BUNDLE_DIR/validate.sh" ]; then
    fail "validate.sh is missing or not executable in $BUNDLE_DIR"
  fi

  echo "Verifying canonical bundle before packaging..."
  "$BUNDLE_DIR/validate.sh" "$BUNDLE_DIR"
}

manifest_paths() {
  awk '
    /^[[:space:]]*-[[:space:]]*path:[[:space:]]*/ {
      line = $0
      sub(/^[[:space:]]*-[[:space:]]*path:[[:space:]]*/, "", line)
      print line
    }
  ' "$MANIFEST"
}

should_include() {
  local mode="$1"
  local path="$2"

  case "$mode" in
    strict)
      return 0
      ;;
    clawhub)
      case "$path" in
        SKILL.md|README.md|evals.json|evals-distribution.json|assets/*|references/*)
          return 0
          ;;
        *)
          return 1
          ;;
      esac
      ;;
    *)
      return 1
      ;;
  esac
}

copy_bundle_files() {
  local mode="$1"
  local dest_dir="$2"
  local rel_path=""

  mkdir -p "$dest_dir"
  cp -p "$MANIFEST" "$dest_dir/MANIFEST.yaml"

  while IFS= read -r rel_path; do
    [ -n "$rel_path" ] || continue
    if should_include "$mode" "$rel_path"; then
      mkdir -p "$dest_dir/$(dirname "$rel_path")"
      cp -p "$BUNDLE_DIR/$rel_path" "$dest_dir/$rel_path"
    fi
  done < <(manifest_paths)
}

strip_skill_metadata() {
  local skill_file="$1"
  local temp_file

  temp_file="$(mktemp "${TMPDIR:-/tmp}/skill-provenance-skill.XXXXXX")"

  awk '
    BEGIN {
      in_frontmatter = 0
      skipping_metadata = 0
    }
    NR == 1 && $0 == "---" {
      in_frontmatter = 1
      print
      next
    }
    in_frontmatter {
      if ($0 == "---") {
        print
        in_frontmatter = 0
        skipping_metadata = 0
        next
      }
      if (skipping_metadata) {
        if ($0 ~ /^[^[:space:]]/) {
          skipping_metadata = 0
        } else {
          next
        }
      }
      if ($0 ~ /^metadata:[[:space:]]*$/) {
        skipping_metadata = 1
        next
      }
      print
      next
    }
    { print }
  ' "$skill_file" > "$temp_file"

  mv "$temp_file" "$skill_file"
}

rewrite_manifest() {
  local manifest_file="$1"
  local target_mode="$2"
  local include_mode="$3"
  local temp_file

  temp_file="$(mktemp "${TMPDIR:-/tmp}/skill-provenance-manifest.XXXXXX")"

  awk -v target_mode="$target_mode" -v include_mode="$include_mode" '
    function include_path(path) {
      if (include_mode == "strict") {
        return 1
      }
      return path == "SKILL.md" ||
             path == "README.md" ||
             path == "evals.json" ||
             path == "evals-distribution.json" ||
             path ~ /^assets\// ||
             path ~ /^references\//
    }
    function flush_entry() {
      if (entry == "") {
        return
      }
      if (keep_entry) {
        printf "%s", entry
      }
      entry = ""
      keep_entry = 0
    }
    {
      if (skipping_deployments) {
        if ($0 ~ /^[^[:space:]]/) {
          skipping_deployments = 0
        } else {
          next
        }
      }

      if ($0 ~ /^deployments:[[:space:]]*$/) {
        skipping_deployments = 1
        next
      }

      if (!in_files) {
        if ($0 ~ /^[[:space:]]*frontmatter_mode:[[:space:]]*/) {
          sub(/frontmatter_mode:[[:space:]]*.*/, "frontmatter_mode: " target_mode)
        }
        print
        if ($0 ~ /^files:[[:space:]]*$/) {
          in_files = 1
        }
        next
      }

      if ($0 ~ /^[[:space:]]*-[[:space:]]*path:[[:space:]]*/) {
        flush_entry()
        path = $0
        sub(/^[[:space:]]*-[[:space:]]*path:[[:space:]]*/, "", path)
        entry = $0 ORS
        keep_entry = include_path(path)
        next
      }

      entry = entry $0 ORS
    }
    END {
      flush_entry()
    }
  ' "$manifest_file" > "$temp_file"

  mv "$temp_file" "$manifest_file"
}

update_hashes() {
  local bundle_dir="$1"
  local manifest_file="$bundle_dir/MANIFEST.yaml"
  local updates_file
  local temp_manifest
  local current_path=""
  local current_hash=""
  local path=""
  local expected=""
  local actual=""

  updates_file="$(mktemp "${TMPDIR:-/tmp}/skill-provenance-updates.XXXXXX")"
  temp_manifest="$(mktemp "${TMPDIR:-/tmp}/skill-provenance-manifest.XXXXXX")"

  declare -a paths=()
  declare -a expected_hashes=()

  while IFS= read -r line; do
    if [[ "$line" =~ ^[[:space:]]*-[[:space:]]*path:[[:space:]]*(.+)$ ]]; then
      if [ -n "$current_path" ]; then
        paths+=("$current_path")
        expected_hashes+=("$current_hash")
      fi
      current_path="${BASH_REMATCH[1]}"
      current_hash=""
      continue
    fi
    if [[ "$line" =~ ^[[:space:]]*hash:[[:space:]]*sha256:([a-f0-9]+)$ ]]; then
      current_hash="${BASH_REMATCH[1]}"
    fi
  done < "$manifest_file"

  if [ -n "$current_path" ]; then
    paths+=("$current_path")
    expected_hashes+=("$current_hash")
  fi

  for i in "${!paths[@]}"; do
    path="${paths[$i]}"
    expected="${expected_hashes[$i]}"
    [ -n "$expected" ] || continue
    actual="$(sha256_hash "$bundle_dir/$path")"
    if [ "$actual" != "$expected" ]; then
      printf '%s\t%s\n' "$path" "$actual" >> "$updates_file"
    fi
  done

  awk -v updates_file="$updates_file" '
    BEGIN {
      while ((getline line < updates_file) > 0) {
        split(line, fields, "\t")
        replacements[fields[1]] = fields[2]
      }
      close(updates_file)
      current_path = ""
    }
    {
      line = $0
      if (line ~ /^[[:space:]]*-[[:space:]]*path:[[:space:]]*/) {
        current_path = line
        sub(/^[[:space:]]*-[[:space:]]*path:[[:space:]]*/, "", current_path)
      }
      if (current_path != "" &&
          (current_path in replacements) &&
          line ~ /^[[:space:]]*hash:[[:space:]]*sha256:[a-f0-9]+[[:space:]]*$/) {
        sub(/sha256:[a-f0-9]+/, "sha256:" replacements[current_path], line)
        current_path = ""
      }
      print line
    }
  ' "$manifest_file" > "$temp_manifest"

  mv "$temp_manifest" "$manifest_file"
  rm -f "$updates_file"
}

build_variant() {
  local mode="$1"
  local output_parent="$2"
  local variant_parent="$output_parent"
  local dest_dir

  case "$mode" in
    strict|clawhub)
      ;;
    *)
      fail "internal error: unsupported variant $mode"
      ;;
  esac

  if [ -e "$variant_parent" ]; then
    fail "output path already exists: $variant_parent"
  fi

  dest_dir="$variant_parent/$BUNDLE_NAME"
  copy_bundle_files "$mode" "$dest_dir"

  case "$mode" in
    strict)
      strip_skill_metadata "$dest_dir/SKILL.md"
      rewrite_manifest "$dest_dir/MANIFEST.yaml" "minimal" "strict"
      ;;
    clawhub)
      rewrite_manifest "$dest_dir/MANIFEST.yaml" "metadata" "clawhub"
      ;;
  esac

  update_hashes "$dest_dir"
  echo "Built $mode package at $dest_dir"
}

validate_source_bundle

if [ "$MODE" = "all" ]; then
  build_variant "strict" "$OUTPUT_PARENT/strict"
  build_variant "clawhub" "$OUTPUT_PARENT/clawhub"
else
  build_variant "$MODE" "$OUTPUT_PARENT"
fi
