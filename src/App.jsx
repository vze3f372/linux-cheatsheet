import React, { useEffect, useMemo, useState } from "react";

/**
 * Linux Commands Cheat Sheet (Beginner)
 * - Homepage: quick cheat sheet grouped by sections
 * - Click a command: detailed view with description + annotated examples
 * - Search: filters commands across all sections
 * - Hash routing: #/ and #/cmd/<slug>
 *
 * Drop into a React project (Vite / CRA / Next client component).
 * If using Next.js, add: "use client" at the top.
 */

const COMMANDS = [
  {
    section: "File & Directory Navigation",
    items: [
      {
        name: "pwd",
        slug: "pwd",
        brief: "Print the absolute path of the current working directory",
        description:
          "Displays the full absolute path of your current working directory (the directory your shell is currently operating in).",
        examples: [{ cmd: "pwd", meaning: "Outputs the current directory path" }],
      },
      {
        name: "ls",
        slug: "ls",
        brief: "List directory contents",
        description:
          "Lists files and directories. Without arguments it lists the current directory. With options, it can show hidden files, details, and human-readable sizes.",
        examples: [
          { cmd: "ls", meaning: "List entries in the current directory" },
          {
            cmd: "ls -l",
            meaning:
              "Long listing with permissions, owner/group, size, and timestamps",
          },
          { cmd: "ls -a", meaning: "Include hidden entries (dotfiles)" },
          {
            cmd: "ls -lh",
            meaning: "Long listing with human-readable sizes (KB/MB/GB)",
          },
        ],
        options: [
          { flag: "-l", desc: "Long format" },
          { flag: "-a", desc: "All files (including hidden)" },
          { flag: "-h", desc: "Human-readable sizes (usually with -l)" },
        ],
      },
      {
        name: "cd",
        slug: "cd",
        brief: "Change directory",
        description:
          "Changes the shell’s current working directory. Supports absolute paths (/etc), relative paths (../src), and shortcuts like ~ (home) and - (previous directory).",
        examples: [
          { cmd: "cd /etc", meaning: "Go to /etc (absolute path)" },
          { cmd: "cd ..", meaning: "Move up one directory (parent)" },
          { cmd: "cd ~", meaning: "Go to your home directory" },
          { cmd: "cd -", meaning: "Switch to the previous working directory" },
        ],
      },
    ],
  },
  {
    section: "File & Directory Management",
    items: [
      {
        name: "touch",
        slug: "touch",
        brief: "Create a file or update its timestamp",
        description:
          "Creates an empty file if it doesn’t exist. If it does exist, updates its access/modification timestamps.",
        examples: [
          {
            cmd: "touch file.txt",
            meaning: "Create file.txt if missing; otherwise update timestamps",
          },
        ],
      },
      {
        name: "mkdir",
        slug: "mkdir",
        brief: "Create directories",
        description:
          "Creates one or more directories. Use -p to create parent directories as needed (and avoid errors if they already exist).",
        examples: [
          { cmd: "mkdir test", meaning: "Create a directory named test" },
          {
            cmd: "mkdir -p a/b/c",
            meaning: "Create nested directories a, a/b, and a/b/c",
          },
        ],
        options: [{ flag: "-p", desc: "Create parents as needed" }],
      },
      {
        name: "cp",
        slug: "cp",
        brief: "Copy files (and directories with -r)",
        description:
          "Copies files. To copy directories, use -r (recursive). Useful options include -v (verbose) and -i (prompt before overwrite).",
        examples: [
          { cmd: "cp file1 file2", meaning: "Copy file1 to file2" },
          {
            cmd: "cp -r dir1 dir2",
            meaning: "Copy dir1 to dir2 recursively",
          },
          {
            cmd: "cp -vi file1 file2",
            meaning: "Verbose + prompt before overwriting",
          },
        ],
        options: [
          { flag: "-r", desc: "Recursive (directories)" },
          { flag: "-v", desc: "Verbose" },
          { flag: "-i", desc: "Prompt before overwrite" },
        ],
      },
      {
        name: "mv",
        slug: "mv",
        brief: "Move or rename files/directories",
        description:
          "Moves files/directories to a new location or renames them. Can overwrite existing targets unless you use -i.",
        examples: [
          { cmd: "mv file.txt new.txt", meaning: "Rename file.txt to new.txt" },
          { cmd: "mv file.txt /tmp/", meaning: "Move file.txt into /tmp" },
          {
            cmd: "mv -i file.txt /tmp/",
            meaning: "Prompt before overwriting a file in /tmp",
          },
        ],
        options: [{ flag: "-i", desc: "Prompt before overwrite" }],
      },
      {
        name: "rm",
        slug: "rm",
        brief: "Remove files/directories",
        description:
          "Deletes files. Use -r to remove directories recursively. Use -f to force removal (no prompts). Be very careful with rm -rf.",
        examples: [
          { cmd: "rm file.txt", meaning: "Delete file.txt" },
          {
            cmd: "rm -r build/",
            meaning: "Delete the build directory and its contents",
          },
          {
            cmd: "rm -rf build/",
            meaning: "Force delete build/ without prompts (dangerous)",
          },
          {
            cmd: "rm -i file.txt",
            meaning: "Prompt before deleting file.txt",
          },
        ],
        options: [
          { flag: "-r", desc: "Recursive (directories)" },
          { flag: "-f", desc: "Force" },
          { flag: "-i", desc: "Prompt before delete" },
        ],
        caution:
          "Double-check the path before running rm -rf. A typo can delete large parts of your system.",
      },
    ],
  },
  {
    section: "Viewing & Editing",
    items: [
      {
        name: "cat",
        slug: "cat",
        brief: "Print file contents",
        description:
          "Outputs file contents to stdout. Great for small files. For large files, use less.",
        examples: [
          { cmd: "cat file.txt", meaning: "Print file.txt to the terminal" },
          {
            cmd: "cat a.txt b.txt",
            meaning: "Print a.txt then b.txt (concatenate)",
          },
        ],
      },
      {
        name: "less",
        slug: "less",
        brief: "Scrollable file viewer",
        description:
          "Interactive pager for viewing large files efficiently. Supports searching and scrolling.",
        examples: [
          { cmd: "less file.txt", meaning: "Open file.txt in an interactive viewer" },
          { cmd: "less /var/log/syslog", meaning: "View a log file" },
        ],
        options: [
          { flag: "/pattern", desc: "Search forward inside less" },
          { flag: "n", desc: "Next match" },
          { flag: "q", desc: "Quit" },
        ],
      },
      {
        name: "head",
        slug: "head",
        brief: "Show first lines of a file",
        description:
          "Prints the beginning of a file (default 10 lines). Useful for checking headers and formats.",
        examples: [
          { cmd: "head file.txt", meaning: "Show the first 10 lines" },
          { cmd: "head -n 20 file.txt", meaning: "Show the first 20 lines" },
        ],
        options: [{ flag: "-n <N>", desc: "Number of lines" }],
      },
      {
        name: "tail",
        slug: "tail",
        brief: "Show last lines of a file",
        description:
          "Prints the end of a file (default 10 lines). With -f, it follows appended data (great for logs).",
        examples: [
          { cmd: "tail file.txt", meaning: "Show the last 10 lines" },
          { cmd: "tail -n 50 file.txt", meaning: "Show the last 50 lines" },
          { cmd: "tail -f app.log", meaning: "Follow new log lines as they are written" },
        ],
        options: [
          { flag: "-n <N>", desc: "Number of lines" },
          { flag: "-f", desc: "Follow (stream updates)" },
        ],
      },
      {
        name: "nano",
        slug: "nano",
        brief: "Simple terminal editor",
        description:
          "A beginner-friendly terminal text editor. Shows common shortcuts at the bottom.",
        examples: [
          { cmd: "nano file.txt", meaning: "Open file.txt for editing" },
          { cmd: "nano /etc/hosts", meaning: "Edit a system file (often with sudo)" },
        ],
      },
      {
        name: "vim",
        slug: "vim",
        brief: "Advanced modal editor",
        description:
          "A powerful modal editor. Efficient once learned, but has a learning curve.",
        examples: [
          { cmd: "vim file.txt", meaning: "Open file.txt in vim" },
          { cmd: "vim +/pattern file.txt", meaning: "Open and jump to first match of pattern" },
        ],
      },
    ],
  },
  {
    section: "Searching",
    items: [
      {
        name: "grep",
        slug: "grep",
        brief: "Search for patterns in text",
        description:
          "Searches input for lines matching a pattern (regular expressions supported). Often used to filter command output.",
        examples: [
          { cmd: 'grep "main" file.c', meaning: 'Find lines containing "main"' },
          { cmd: 'grep -i "error" log.txt', meaning: "Case-insensitive search" },
          { cmd: 'grep -rin "error" .', meaning: "Recursive search with line numbers" },
          { cmd: "ps aux | grep ssh", meaning: "Find ssh-related processes (basic filtering)" },
        ],
        options: [
          { flag: "-r", desc: "Recursive" },
          { flag: "-i", desc: "Ignore case" },
          { flag: "-n", desc: "Show line numbers" },
          { flag: "-E", desc: "Extended regex" },
        ],
      },
      {
        name: "find",
        slug: "find",
        brief: "Find files/directories by criteria",
        description:
          "Searches directory trees for entries matching conditions like name, type, size, or modification time.",
        examples: [
          { cmd: 'find . -name "*.cpp"', meaning: "Find C++ files under the current directory" },
          { cmd: 'find /etc -type f -name "*.conf"', meaning: "Find .conf files in /etc" },
          { cmd: "find . -type f -mtime -1", meaning: "Files modified in the last 24 hours" },
        ],
        options: [
          { flag: "-name <pattern>", desc: "Match by name (glob-style)" },
          { flag: "-type f|d", desc: "File or directory" },
          { flag: "-mtime <N>", desc: "Modified time in days" },
        ],
      },
    ],
  },
  {
    section: "Package Management (Debian/Ubuntu)",
    items: [
      {
        name: "apt update",
        slug: "apt-update",
        brief: "Refresh package index",
        description:
          "Updates your local package index so your system knows what versions are available from repositories.",
        examples: [
          { cmd: "sudo apt update", meaning: "Refresh package lists (recommended before installs/upgrades)" },
        ],
      },
      {
        name: "apt upgrade",
        slug: "apt-upgrade",
        brief: "Upgrade installed packages",
        description:
          "Upgrades installed packages to newer versions according to the updated package index.",
        examples: [
          { cmd: "sudo apt upgrade", meaning: "Upgrade installed packages" },
          { cmd: "sudo apt upgrade -y", meaning: "Upgrade and auto-confirm prompts" },
        ],
        options: [{ flag: "-y", desc: "Assume yes to prompts" }],
      },
      {
        name: "apt install",
        slug: "apt-install",
        brief: "Install a package",
        description:
          "Installs packages and their dependencies from configured repositories.",
        examples: [
          { cmd: "sudo apt install git", meaning: "Install git" },
          { cmd: "sudo apt install -y htop", meaning: "Install htop without prompting" },
        ],
        options: [{ flag: "-y", desc: "Assume yes to prompts" }],
      },
      {
        name: "apt remove",
        slug: "apt-remove",
        brief: "Remove a package",
        description:
          "Removes a package but may leave configuration files behind (use purge to remove configs too).",
        examples: [
          { cmd: "sudo apt remove git", meaning: "Remove git" },
          { cmd: "sudo apt purge git", meaning: "Remove git and its configuration files" },
        ],
      },
    ],
  },
  {
    section: "Permissions & Ownership",
    items: [
      {
        name: "chmod",
        slug: "chmod",
        brief: "Change file permissions",
        description:
          "Changes permission bits (read/write/execute) for user, group, and others. Commonly used to make scripts executable.",
        examples: [
          { cmd: "chmod +x script.sh", meaning: "Add execute permission (so you can run it)" },
          { cmd: "chmod 644 file.txt", meaning: "rw-r--r-- (owner read/write; others read)" },
          { cmd: "chmod 755 app", meaning: "rwxr-xr-x (typical for executables)" },
        ],
      },
      {
        name: "chown",
        slug: "chown",
        brief: "Change owner and group",
        description:
          "Changes a file’s owning user and/or group. Often used after creating files with sudo or when fixing permissions.",
        examples: [
          { cmd: "sudo chown user:group file", meaning: "Set the owner to user and group to group" },
          { cmd: "sudo chown -R user:group dir", meaning: "Recursively change ownership under dir" },
        ],
        options: [{ flag: "-R", desc: "Recursive" }],
      },
    ],
  },
  {
    section: "Processes & Monitoring",
    items: [
      {
        name: "ps aux",
        slug: "ps-aux",
        brief: "List running processes",
        description:
          "Shows a snapshot of running processes. The common ps aux form lists processes for all users with detailed columns.",
        examples: [
          { cmd: "ps aux", meaning: "List all processes with details" },
          { cmd: "ps aux | grep ssh", meaning: "Filter for ssh-related processes" },
        ],
      },
      {
        name: "top",
        slug: "top",
        brief: "Real-time process monitor",
        description:
          "Interactive view of CPU/memory usage per process. Good for quickly spotting resource hogs.",
        examples: [{ cmd: "top", meaning: "Open real-time process viewer" }],
      },
      {
        name: "htop",
        slug: "htop",
        brief: "Enhanced process monitor",
        description:
          "A more user-friendly alternative to top (colored UI, easier sorting, kill from UI). Note: Must be installed using \"sudo apt install htop\"",
        examples: [{ cmd: "htop", meaning: "Open enhanced process viewer" }],
      },
      {
        name: "kill",
        slug: "kill",
        brief: "Send a signal to a process",
        description:
          "Sends a signal to a process by PID. Default is SIGTERM (graceful stop). SIGKILL (-9) forces termination.",
        examples: [
          { cmd: "kill 1234", meaning: "Request process 1234 to terminate (SIGTERM)" },
          { cmd: "kill -9 1234", meaning: "Force kill process 1234 (SIGKILL)" },
        ],
        options: [{ flag: "-9", desc: "SIGKILL (force)" }],
      },
    ],
  },
  {
    section: "Networking",
    items: [
      {
        name: "ping",
        slug: "ping",
        brief: "Test connectivity and latency",
        description:
          "Sends ICMP echo requests to a host to test reachability and measure latency (round-trip time).",
        examples: [
          { cmd: "ping google.com", meaning: "Test whether google.com is reachable" },
          { cmd: "ping -c 4 1.1.1.1", meaning: "Send 4 pings then stop" },
        ],
        options: [{ flag: "-c <N>", desc: "Count (send N packets)" }],
      },
      {
        name: "ip a",
        slug: "ip-a",
        brief: "Show interfaces and IP addresses",
        description:
          "Displays network interfaces and their IP addresses. ip replaces older tools like ifconfig on many systems.",
        examples: [
          { cmd: "ip a", meaning: "Show all interfaces and addresses" },
          { cmd: "ip a show wlan0", meaning: "Show addresses for wlan0" },
        ],
      },
      {
        name: "curl",
        slug: "curl",
        brief: "Transfer data from/to URLs",
        description:
          "Fetches content from URLs (HTTP/S, etc.). Often used for APIs, downloads, and debugging web requests.",
        examples: [
          { cmd: "curl https://example.com", meaning: "Fetch a webpage" },
          { cmd: "curl -I https://example.com", meaning: "Fetch only response headers" },
          { cmd: "curl -L https://example.com/file -o file", meaning: "Follow redirects and save to file" },
        ],
        options: [
          { flag: "-I", desc: "Headers only" },
          { flag: "-L", desc: "Follow redirects" },
          { flag: "-o <file>", desc: "Write output to file" },
        ],
      },
      {
        name: "wget",
        slug: "wget",
        brief: "Download files from URLs",
        description:
          "Downloads files over HTTP/HTTPS/FTP. Often simpler for saving remote files.",
        examples: [
          { cmd: "wget https://example.com/file", meaning: "Download file into current directory" },
          { cmd: "wget -O out.bin https://example.com/file", meaning: "Download and save as out.bin" },
        ],
        options: [{ flag: "-O <file>", desc: "Output filename" }],
      },
    ],
  },
  {
    section: "Disk Usage",
    items: [
      {
        name: "df",
        slug: "df",
        brief: "Show filesystem disk space usage",
        description:
          "Reports free/used disk space per mounted filesystem. -h makes it human-readable.",
        examples: [
          { cmd: "df -h", meaning: "Show disk usage in human-readable units" },
          { cmd: "df -h /", meaning: "Show usage for the filesystem containing /" },
        ],
        options: [{ flag: "-h", desc: "Human-readable" }],
      },
      {
        name: "du",
        slug: "du",
        brief: "Estimate file/directory space usage",
        description:
          "Estimates the disk space used by files and directories. -s summarizes; -h makes it readable.",
        examples: [
          { cmd: "du -sh folder", meaning: "Show total size of folder" },
          { cmd: "du -h --max-depth=1 .", meaning: "Show sizes of items one level deep" },
        ],
        options: [
          { flag: "-s", desc: "Summary" },
          { flag: "-h", desc: "Human-readable" },
          { flag: "--max-depth=<N>", desc: "Limit depth" },
        ],
      },
    ],
  },
  {
    section: "Shortcuts & Productivity",
    items: [
      {
        name: "!!",
        slug: "bang-bang",
        brief: "Repeat last command",
        description:
          "Shell history expansion that reruns the previous command. Commonly used with sudo: sudo !!",
        examples: [
          { cmd: "!!", meaning: "Execute the previous command" },
          { cmd: "sudo !!", meaning: "Re-run previous command with sudo" },
        ],
      },
      {
        name: "history",
        slug: "history",
        brief: "Show command history",
        description:
          "Prints your shell’s command history list, typically with line numbers.",
        examples: [
          { cmd: "history", meaning: "Show recent commands" },
          { cmd: "history | tail", meaning: "Show the most recent entries" },
        ],
      },
      {
        name: "clear",
        slug: "clear",
        brief: "Clear terminal display",
        description:
          "Clears the visible terminal screen (does not delete history or scrollback in all terminals).",
        examples: [{ cmd: "clear", meaning: "Clear the terminal view" }],
      },
    ],
  },
  {
    section: "Pipes & Redirection",
    items: [
      {
        name: ">",
        slug: "redirect-overwrite",
        brief: "Redirect output to a file (overwrite)",
        description:
          "Redirects stdout to a file, overwriting the file if it exists.",
        examples: [
          { cmd: "ls > files.txt", meaning: "Write ls output into files.txt (overwrite)" },
          { cmd: "echo hello > greeting.txt", meaning: "Create/overwrite greeting.txt with 'hello'" },
        ],
        caution: "Overwrites the target file.",
      },
      {
        name: ">>",
        slug: "redirect-append",
        brief: "Redirect output to a file (append)",
        description:
          "Redirects stdout to a file, appending to the end if it exists.",
        examples: [
          { cmd: "ls >> files.txt", meaning: "Append ls output to files.txt" },
          { cmd: "echo line >> notes.txt", meaning: "Append a line to notes.txt" },
        ],
      },
      {
        name: "|",
        slug: "pipe",
        brief: "Pipe output from one command into another",
        description:
          "Connects stdout of the left command to stdin of the right command. Core concept for building pipelines.",
        examples: [
          { cmd: "ls | grep txt", meaning: "Filter ls output to only lines containing txt" },
          { cmd: "ps aux | grep ssh", meaning: "Filter process list for ssh" },
        ],
      },
    ],
  },
  {
    section: "Environment",
    items: [
      {
        name: "echo",
        slug: "echo",
        brief: "Print text or variables",
        description:
          "Prints arguments to stdout. Often used to print environment variables.",
        examples: [
          { cmd: "echo hello", meaning: "Print the word 'hello'" },
          { cmd: "echo $HOME", meaning: "Print your home directory path" },
        ],
      },
      {
        name: "export",
        slug: "export",
        brief: "Set an environment variable",
        description:
          "Sets an environment variable in the current shell session (and makes it available to child processes).",
        examples: [
          { cmd: "export VAR=value", meaning: "Set VAR for this session" },
          {
            cmd: "export PATH=\"$PATH:/new/path\"",
            meaning: "Append /new/path to PATH",
          },
        ],
      },
      {
        name: "env",
        slug: "env",
        brief: "List environment variables",
        description:
          "Prints the environment for the current process. Useful for debugging PATH and other variables.",
        examples: [
          { cmd: "env", meaning: "List all environment variables" },
          { cmd: "env | grep PATH", meaning: "Show only PATH variable lines" },
        ],
      },
    ],
  },
  {
    section: "Help & Discovery",
    items: [
      {
        name: "man",
        slug: "man",
        brief: "Open the manual page for a command",
        description:
          "Displays the manual page (documentation) for a command, including synopsis, options, and examples.",
        examples: [
          { cmd: "man ls", meaning: "Open the manual page for ls" },
          { cmd: "man -k network", meaning: "Search manual page descriptions (like apropos)" },
        ],
        options: [{ flag: "-k <keyword>", desc: "Keyword search (apropos-like)" }],
      },
      {
        name: "apropos",
        slug: "apropos",
        brief: "Search commands by description",
        description:
          "Searches the manual page short descriptions for a keyword. Useful when you know what you want to do but not the command name.",
        examples: [
          { cmd: "apropos network", meaning: "Find commands related to networking" },
          { cmd: 'apropos "copy file"', meaning: "Search descriptions for a phrase" },
        ],
      },
    ],
  },
];

function flattenCommands() {
  const list = [];
  for (const sec of COMMANDS) {
    for (const item of sec.items) list.push({ ...item, section: sec.section });
  }
  return list;
}

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash || "#/");
  useEffect(() => {
    const onHash = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return hash;
}

function setRoute(path) {
  window.location.hash = path;
}

function slugToCommand(slug, all) {
  return all.find((c) => c.slug === slug) || null;
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium text-slate-700 bg-white/60">
      {children}
    </span>
  );
}

function CodePill({ text }) {
  return (
    <code className="rounded bg-slate-900 text-slate-50 px-2 py-1 text-sm font-mono">
      {text}
    </code>
  );
}

function Card({ title, subtitle, children, onClick }) {
  const clickable = typeof onClick === "function";
  return (
    <div
      onClick={onClick}
      className={
        "rounded-2xl border bg-white/70 shadow-sm backdrop-blur p-4 " +
        (clickable
          ? "cursor-pointer hover:bg-white transition-colors"
          : "")
      }
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (!clickable) return;
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold text-slate-900">{title}</div>
          {subtitle ? (
            <div className="text-sm text-slate-600 mt-0.5">{subtitle}</div>
          ) : null}
        </div>
        {clickable ? <span className="text-slate-400">→</span> : null}
      </div>
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {children}
      </div>
    </section>
  );
}

function TopBar({ query, setQuery }) {
  return (
    <div className="sticky top-0 z-10 backdrop-blur bg-slate-50/70 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <button
          className="rounded-xl border bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
          onClick={() => setRoute("#/")}
          title="Home"
        >
          Linux Cheatsheet
        </button>
        <div className="flex-1" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          placeholder="Search commands (e.g., grep, permissions, network)…"
        />
      </div>
    </div>
  );
}

function Home({ query }) {
  const all = useMemo(() => flattenCommands(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return all.filter((c) => {
      const hay = [
        c.name,
        c.slug,
        c.brief,
        c.description,
        c.section,
        ...(c.examples || []).map((e) => e.cmd + " " + e.meaning),
        ...(c.options || []).map((o) => o.flag + " " + o.desc),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [all, query]);

  if (filtered) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-sm text-slate-600">
          Showing {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((c) => (
            <Card
              key={c.slug}
              title={<CodePill text={c.name} />}
              subtitle={c.brief}
              onClick={() => setRoute(`#/cmd/${c.slug}`)}
            >
              <div className="flex flex-wrap gap-2">
                <Badge>{c.section}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <header className="rounded-2xl border bg-white/70 shadow-sm backdrop-blur p-5">
        <div className="text-2xl font-extrabold text-slate-900">
          Linux Terminal Commands
        </div>
        <div className="mt-1 text-slate-600">
          Click a command to view detailed descriptions and annotated examples.
        </div>
      </header>

      {COMMANDS.map((sec) => (
        <Section key={sec.section} title={sec.section}>
          {sec.items.map((c) => (
            <Card
              key={c.slug}
              title={<CodePill text={c.name} />}
              subtitle={c.brief}
              onClick={() => setRoute(`#/cmd/${c.slug}`)}
            />
          ))}
        </Section>
      ))}

      <footer className="mt-10 text-xs text-slate-500">
        Tip: This page uses hash routing, so you can host it on GitHub Pages or
        any static host without server rewrites.
      </footer>
    </div>
  );
}

function Detail({ slug }) {
  const all = useMemo(() => flattenCommands(), []);
  const cmd = useMemo(() => slugToCommand(slug, all), [slug, all]);

  useEffect(() => {
    if (!cmd) return;
    document.title = `${cmd.name} — Linux Cheatsheet`;
    return () => {
      document.title = "Linux Cheatsheet";
    };
  }, [cmd]);

  if (!cmd) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Card title="Not found" subtitle="That command slug doesn't exist.">
          <button
            className="mt-3 rounded-xl border bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
            onClick={() => setRoute("#/")}
          >
            Back to home
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <button
          className="rounded-xl border bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
          onClick={() => setRoute("#/")}
        >
          ← Back
        </button>
        <Badge>{cmd.section}</Badge>
      </div>

      <div className="mt-4 rounded-2xl border bg-white/70 shadow-sm backdrop-blur p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              <span className="font-mono">{cmd.name}</span>
            </div>
            <div className="mt-1 text-slate-600">{cmd.brief}</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm font-semibold text-slate-900">What it does</div>
          <div className="mt-1 text-slate-700 leading-relaxed">
            {cmd.description}
          </div>
        </div>

        {cmd.caution ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <div className="text-sm font-semibold text-amber-900">Caution</div>
            <div className="mt-1 text-sm text-amber-900/90">{cmd.caution}</div>
          </div>
        ) : null}

        {cmd.options?.length ? (
          <div className="mt-5">
            <div className="text-sm font-semibold text-slate-900">Common options</div>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {cmd.options.map((o) => (
                <div
                  key={o.flag}
                  className="rounded-xl border bg-white p-3"
                >
                  <div className="font-mono text-sm text-slate-900">{o.flag}</div>
                  <div className="mt-1 text-sm text-slate-700">{o.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {cmd.examples?.length ? (
          <div className="mt-5">
            <div className="text-sm font-semibold text-slate-900">Examples</div>
            <div className="mt-2 space-y-2">
              {cmd.examples.map((e, idx) => (
                <div key={idx} className="rounded-xl border bg-white p-3">
                  <div className="font-mono text-sm text-slate-900">{e.cmd}</div>
                  <div className="mt-1 text-sm text-slate-700">→ {e.meaning}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            className="rounded-xl border bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
            onClick={() => {
              const text = [
                cmd.name,
                cmd.brief,
                "",
                cmd.description,
                "",
                "Examples:",
                ...(cmd.examples || []).map((x) => `- ${x.cmd} -> ${x.meaning}`),
              ].join("\n");
              navigator.clipboard?.writeText(text);
            }}
          >
            Copy summary
          </button>
          <button
            className="rounded-xl border bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
            onClick={() => setRoute("#/")}
          >
            Browse all commands
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LinuxCheatsheetApp() {
  const hash = useHashRoute();
  const [query, setQuery] = useState("");

  const route = useMemo(() => {
    // Supported:
    // #/                  home
    // #/cmd/<slug>         detail
    const h = (hash || "#/").replace(/^#/, "");
    const parts = h.split("/").filter(Boolean);
    if (parts.length === 0) return { page: "home" };
    if (parts[0] === "cmd" && parts[1]) return { page: "detail", slug: parts[1] };
    return { page: "home" };
  }, [hash]);

  // Clear search when navigating to a detail page
  useEffect(() => {
    if (route.page === "detail") setQuery("");
  }, [route.page]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <TopBar query={query} setQuery={setQuery} />
      {route.page === "detail" ? <Detail slug={route.slug} /> : <Home query={query} />}
    </div>
  );
}
