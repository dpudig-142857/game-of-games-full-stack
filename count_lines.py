import os  
import subprocess

def count_lines_of_code():
  result = subprocess.run(['git', 'ls-files'], capture_output=True, text=True)
  files = result.stdout.splitlines()
  include_files = [
    'frontend/continue.html',
    'frontend/create.html',
    'frontend/game.html',
    'frontend/index.html',
    'frontend/logs.html',
    'frontend/results.html',
    'frontend/stats.html',
    'frontend/css/continue.css',
    'frontend/css/create.css',
    'frontend/css/game.css',
    'frontend/css/home.css',
    'frontend/css/logs.css',
    'frontend/css/results.css',
    'frontend/css/stats.css',
    'frontend/css/user.css',
    'frontend/js/avatar.js',
    'frontend/js/config.js',
    'frontend/js/continue.js',
    'frontend/js/create.js',
    'frontend/js/game.js',
    'frontend/js/home.js',
    'frontend/js/logs.js',
    'frontend/js/results.js',
    'frontend/js/stats.js',
    'frontend/js/user.js',
    'frontend/js/utils.js',
    'backend/server.js',
    'backend/routes/debug.js',
    'backend/routes/games.js',
    'backend/routes/players.js',
    'backend/routes/points.js',
    'backend/routes/sessions.js',
    'backend/routes/stats.js',
    'backend/routes/tournament.js',
    'backend/routes/user.js'
  ]
  filtered_files = [file for file in files if file in include_files]

  total_lines = 0
  for file in filtered_files:
    with open(file, 'r', errors='ignore') as f:
      total_lines += sum(1 for _ in f)

  print(f"Total lines of code (filtered): {total_lines}")

count_lines_of_code()
