
# GitJet CLI

GitJet is a modern and stylish CLI tool designed to simplify Git and GitHub workflows. Whether you're a beginner or an advanced user, GitJet streamlines the most common Git operations in a beautiful CLI with a seamless interactive UI. It offers both command-based and menu-driven options, giving you full flexibility.

---

## Features

- **Quick Commit**: Add, commit, and push all changes with one command.
- **Start Journey**: A beginner-friendly interactive guide to Git.
- **Start Repo**: Initialize and set up a new Git repository.
- **Pull Requests**: Create, list, and merge pull requests effortlessly.
- **Interactive Mode**: Enter an interactive menu to perform Git operations by simply typing and selecting options, no commands required.
- **Visual Feedback**: Get feedback with beautiful, styled output for better user experience.

---

## Installation

Install GitJet globally via npm:

```bash
npm install -g gitjet
```

---

## Usage

Once installed, GitJet can be used through commands or by simply typing `gitjet` to enter interactive mode.

### 1. Enter Interactive Mode (Default)

If you simply type `gitjet` without any additional commands, the tool will start in an interactive mode where you can select actions from a menu instead of typing commands manually.

```bash
gitjet
```

### 2. Start Journey (Perfect for Beginners)
Start your Git journey with an interactive guide.

```bash
gitjet journey
```

### 3. Quick Commit
Add, commit, and push all changes with a single command. You can optionally add a commit message using the `-m` flag.

```bash
gitjet quickcommit -m "Your commit message"
```

### 4. Start Repo
Initialize a new repository in the current directory.

```bash
gitjet start
```

### 5. Manage Pull Requests
Create, list, or merge pull requests.

- **Create a PR**:

```bash
gitjet pr --create
```

- **List PRs**:

```bash
gitjet pr --list
```

- **Merge a PR**:

```bash
gitjet pr --merge <pr_number>
```

---

## Example Workflow

Here is an example of a typical workflow with GitJet:

1. Start your Git journey if you're new to Git:
   ```bash
   gitjet journey
   ```

2. Make changes to your repository.

3. Commit and push changes with:
   ```bash
   gitjet quickcommit -m "Fixed issue #123"
   ```

4. Create a pull request with:
   ```bash
   gitjet pr --create
   ```

5. Manage other pull requests with:
   ```bash
   gitjet pr --list
   gitjet pr --merge 1
   ```

---

## Contributing

GitJet is open-source, and contributions are welcome! If you'd like to contribute, feel free to fork the repository and submit a pull request. Please follow the standard Git workflow for contributing.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

GitJet was created with ❤️ by [Suhaib](https://github.com/Suhaib3100).

---

## Installation and Setup Notes

- Ensure you have Node.js and npm installed.
- GitJet uses `simple-git` for Git operations, `chalk` for terminal colors, and `ora` for spinner effects to enhance the user experience.

---

### Example Output for Quick Commit:

```
Processing quick commit...
Adding changes...
Staged files: ["src/index.js", "src/utils.js"]
Committing changes...
Changes successfully committed and pushed!
```

---

Enjoy using **GitJet** and simplify your Git workflow with style! 🚀
