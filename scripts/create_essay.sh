#!/bin/bash

if [ "$#" -eq 1 ]; then
  # Get input string from command line parameter
  input_string=$1
else
  # Get input string from user input
  echo "Enter post title: "
  read input_string
fi

# Convert to lowercase and replace spaces with hyphens
slug=$(echo "$input_string" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

# Generate file path and name
today=$(date +%Y-%m-%d)
file_name="$today-$slug.md"
file_path="./src/essays/$file_name"

# Write file contents
echo "---" >> "$file_path"
echo "title: $input_string" >> "$file_path"
echo "description: $input_string" >> "$file_path"
echo "date: $today" >> "$file_path"
echo "tags:" >> "$file_path"
echo " - " >> "$file_path"
echo "---" >> "$file_path"

echo "File created: $file_path"