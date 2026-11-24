#!/usr/bin/env bash
set -euo pipefail

root=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
destination="$root/.agents/skills"
staging=$(mktemp -d)
trap 'python3 -c "import shutil, sys; shutil.rmtree(sys.argv[1])" "$staging"' EXIT

fetch_skills() {
  local repository=$1 revision=$2 skill_path=$3 checkout=$4
  git init --quiet "$checkout"
  git -C "$checkout" remote add origin "https://github.com/$repository.git"
  git -C "$checkout" config remote.origin.promisor true
  git -C "$checkout" config remote.origin.partialclonefilter blob:none
  git -C "$checkout" sparse-checkout set "$skill_path"
  git -C "$checkout" fetch --quiet --depth=1 --filter=blob:none origin "$revision"
  git -C "$checkout" checkout --quiet --detach FETCH_HEAD
}

fetch_skills remotion-dev/remotion 0e4c50cc93265b92eaaa40892c86b19c9fc07a0f packages/skills/skills "$staging/remotion"
fetch_skills heygen-com/hyperframes 779bed5c0a6da3c7364d441f8945c2d8a54a8cbe skills "$staging/hyperframes"

mkdir -p "$destination"
for source in "$staging/remotion/packages/skills/skills"/* "$staging/hyperframes/skills"/*; do
  [[ -f "$source/SKILL.md" ]] || continue
  target="$destination/${source##*/}"
  if [[ ! -e "$target" && ! -L "$target" ]]; then
    cp -a -- "$source" "$target"
  fi
done
printf 'Video skills available in %s\n' "$destination"
