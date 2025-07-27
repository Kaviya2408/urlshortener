#!/bin/bash

# Configure Git user info
git config user.name "Kaviya"
git config user.email "kit27.csbs29@gmail.com"

# Start and end dates for commit history
start="2025-07-27"
end="2025-10-28"

# Total number of commits
total_commits=127

# Convert start and end dates to seconds since epoch
start_sec=$(date -d "$start" +%s)
end_sec=$(date -d "$end" +%s)

# Calculate total number of days
days=$(( (end_sec - start_sec)/86400 + 1 ))

# Array to store commits per day
commits_per_day=()
remaining=$total_commits

# Randomly distribute commits across days
for ((i=0;i<days;i++)); do
    if [ $i -eq $((days-1)) ]; then
        commits_per_day+=($remaining)
    else
        max=$((remaining - (days-i-1)))
        rand=$((1 + RANDOM % max))
        commits_per_day+=($rand)
        remaining=$((remaining - rand))
    fi
done

# Array of realistic commit messages
messages=(
"Added new feature"
"Fixed bug in module"
"Refactored code"
"Updated README"
"Improved performance"
"Added unit tests"
"Updated dependencies"
"Code cleanup"
"Optimized function"
"Minor fixes"
"Added comments"
"Fixed styling issues"
"Updated configuration"
"Removed unused code"
"Enhanced UI"
)

# Current day starts from start date
current_sec=$start_sec

# Loop through each day and make commits
for commits in "${commits_per_day[@]}"; do
    date_commit=$(date -d @$current_sec "+%Y-%m-%d 12:00:00")
    
    for ((i=0;i<commits;i++)); do
        # Make a small change to temp.txt to allow commit
        echo "// change $RANDOM" >> temp.txt
        git add temp.txt
        
        # Pick a random commit message
        msg="${messages[RANDOM % ${#messages[@]}]}"
        
        # Commit with specific date
        GIT_AUTHOR_DATE="$date_commit" GIT_COMMITTER_DATE="$date_commit" git commit -m "$msg"
    done
    
    # Move to next day
    current_sec=$((current_sec + 86400))
done

# Ensure branch is main
git branch -M main

# Force push to GitHub
git push -u origin main --force
