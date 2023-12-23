#!/bin/bash

# Define the directory name
directory_name="/assets"

# Check if the directory already exists
if [ -d "$directory_name" ]; then
  echo "Directory '$directory_name' already exists."
else
  # Create the directory
  sudo mkdir -p "$directory_name"
  echo "Directory '$directory_name' created."
fi

# Assign read and write permissions to the directory and its contents
sudo chmod -R 0777 "$directory_name"

echo "Read and write permissions assigned recursively to '$directory_name'."
