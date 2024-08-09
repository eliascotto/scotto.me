#!/bin/bash

if [ "$#" -eq 1 ]; then
    # Get input string from command line parameter
    input_string=$1
else
    # Get input string from user input
    echo "Enter article title: "
    read input_string
fi

# Convert to lowercase and replace spaces with hyphens
slug=$(echo "$input_string" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

# Generate file path and name
today=$(date +%Y-%m-%d)
file_name="$today-$slug.md"
file_path="./src/articles/$file_name"

# Write file contents
echo "---" >> "$file_path"
echo "title: $input_string" >> "$file_path"
echo "description: $input_string" >> "$file_path"
echo "date: $today" >> "$file_path"
echo "tags:" >> "$file_path"
echo " - " >> "$file_path"
echo "---" >> "$file_path"

echo "File created: $file_path"

# Ask about Italian version
echo "Do you need an Italian version? (YES/no)"
read italian_version

# Convert input to lowercase for easier comparison
italian_version=$(echo "$italian_version" | tr '[:upper:]' '[:lower:]')

# Check if Italian version is needed (default is yes)
if [ "$italian_version" = "no" ]; then
    echo "Italian version not created."
else
    # Create Italian version
    ita_file_path="./src/ita/$file_name"
    cp "$file_path" "$ita_file_path"
    echo "Italian version created: $ita_file_path"
fi