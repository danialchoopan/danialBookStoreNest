#!/bin/bash
set -euo pipefail

git config user.name "danialch"
git config user.email "danialchpan@gmail.com"

RANDOM=$(date +%s%N)

SHOULD_RUN=$((RANDOM % 4))
if [ $SHOULD_RUN -ne 0 ]; then
  exit 0
fi

update_types=(
  "docs"
  "refactor"
  "chore"
  "style"
  "test"
  "perf"
  "fix"
  "feat"
)

commit_messages=(
  "Update documentation"
  "Fix formatting issues"
  "Add comments for clarity"
  "Refactor code structure"
  "Update dependencies"
  "Improve performance"
  "Add unit tests"
  "Clean up code"
  "Update README"
  "Fix minor bugs"
  "Optimize queries"
  "Update configuration"
  "Add error handling"
  "Improve logging"
  "Update API endpoints"
  "Add validation"
  "Remove deprecated code"
  "Update error messages"
)

random_element() {
  local arr=("$@")
  echo "${arr[RANDOM % ${#arr[@]}]}"
}

safe_commit() {
  local msg="$1"
  local max_attempts=3
  local attempt=0
  
  while [ $attempt -lt $max_attempts ]; do
    if git commit -m "$msg"; then
      return 0
    fi
    attempt=$((attempt + 1))
    git add .
    sleep 2
  done
  
  git commit --allow-empty -m "$msg"
  return 0
}

create_random_update() {
  local type=$(random_element "${update_types[@]}")
  local message=$(random_element "${commit_messages[@]}")
  local date=$(date -u '+%Y-%m-%d')
  local time=$(date -u '+%H:%M:%S')
  local random_num=$((RANDOM % 10000 + 1))
  
  case $type in
    "docs")
      mkdir -p docs
      echo "# Documentation Update" > docs/update-$date-$random_num.md
      echo "Last updated: $date $time UTC" >> docs/update-$date-$random_num.md
      echo "Type: $type" >> docs/update-$date-$random_num.md
      echo "Author: danialch" >> docs/update-$date-$random_num.md
      echo "## Changes" >> docs/update-$date-$random_num.md
      echo "- Updated content structure" >> docs/update-$date-$random_num.md
      echo "- Added examples" >> docs/update-$date-$random_num.md
      echo "- Fixed typos" >> docs/update-$date-$random_num.md
      ;;
    "refactor")
      mkdir -p .refactor-logs
      echo "[$date $time] Refactored module $(($RANDOM % 10 + 1))" >> .refactor-logs/refactor.log
      echo "Changed lines: $(($RANDOM % 50 + 5))" >> .refactor-logs/refactor.log
      echo "Author: danialch" >> .refactor-logs/refactor.log
      echo "Refactoring type: $(random_element "structural" "algorithmic" "readability")" >> .refactor-logs/refactor.log
      echo "---" >> .refactor-logs/refactor.log
      ;;
    "chore")
      mkdir -p .chores
      echo "chore: $message" > .chores/$date-$random_num.txt
      echo "Completed at: $time" >> .chores/$date-$random_num.txt
      echo "User: danialch" >> .chores/$date-$random_num.txt
      echo "Status: $(random_element "completed" "in-progress" "verified")" >> .chores/$date-$random_num.txt
      ;;
    "style")
      mkdir -p .style-updates
      echo "Style update: $message" > .style-updates/style-$date-$random_num.txt
      echo "Formatting changes applied" >> .style-updates/style-$date-$random_num.txt
      echo "Updated by: danialch" >> .style-updates/style-$date-$random_num.txt
      echo "Files affected: $(($RANDOM % 5 + 1))" >> .style-updates/style-$date-$random_num.txt
      ;;
    "test")
      mkdir -p tests
      echo "Test suite updated" > tests/test-$date-$random_num.txt
      echo "Tests passed: $(($RANDOM % 100 + 50))" >> tests/test-$date-$random_num.txt
      echo "Coverage: $(($RANDOM % 30 + 70))%" >> tests/test-$date-$random_num.txt
      echo "Author: danialch" >> tests/test-$date-$random_num.txt
      echo "Test type: $(random_element "unit" "integration" "e2e")" >> tests/test-$date-$random_num.txt
      ;;
    "perf")
      mkdir -p .performance
      echo "Performance improvement: $message" > .performance/perf-$date-$random_num.txt
      echo "Improvement: $(($RANDOM % 20 + 5))%" >> .performance/perf-$date-$random_num.txt
      echo "Optimized by: danialch" >> .performance/perf-$date-$random_num.txt
      echo "Metric: $(random_element "execution-time" "memory-usage" "load-time")" >> .performance/perf-$date-$random_num.txt
      ;;
    "fix")
      mkdir -p .fixes
      echo "Bug fix: $message" > .fixes/fix-$date-$random_num.txt
      echo "Fixed by: danialch" >> .fixes/fix-$date-$random_num.txt
      echo "Severity: $(random_element "minor" "major" "critical")" >> .fixes/fix-$date-$random_num.txt
      echo "Status: $(random_element "resolved" "verified" "deployed")" >> .fixes/fix-$date-$random_num.txt
      ;;
    "feat")
      mkdir -p .features
      echo "New feature: $message" > .features/feat-$date-$random_num.txt
      echo "Implemented by: danialch" >> .features/feat-$date-$random_num.txt
      echo "Priority: $(random_element "high" "medium" "low")" >> .features/feat-$date-$random_num.txt
      echo "Status: $(random_element "implemented" "tested" "reviewed")" >> .features/feat-$date-$random_num.txt
      ;;
    *)
      mkdir -p .updates
      echo "$message - $date $time" >> .updates/daily-log.txt
      echo "User: danialch" >> .updates/daily-log.txt
      ;;
  esac
  
  if [ $(($RANDOM % 2)) -eq 0 ]; then
    echo "# Additional update $random_num" > .temp-$random_num.md
    echo "Content generated: $date $time" >> .temp-$random_num.md
    echo "Author: danialch" >> .temp-$random_num.md
    echo "Type: $(random_element "documentation" "comment" "config")" >> .temp-$random_num.md
  fi
}

OPTIONS=(1 2 2 4 4 4)
NUM_UPDATES=${OPTIONS[$RANDOM % ${#OPTIONS[@]}]}

COMMITTED=0
for i in $(seq 1 $NUM_UPDATES); do
  create_random_update
  
  git add .
  
  MSG=$(random_element "${commit_messages[@]}")
  if safe_commit "$MSG"; then
    COMMITTED=$((COMMITTED + 1))
  fi
done

if [ $COMMITTED -eq 0 ]; then
  git commit --allow-empty -m "chore: daily sync $(date -u '+%Y-%m-%d')"
fi