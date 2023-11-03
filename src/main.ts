import Ask from "https://deno.land/x/ask@1.0.6/mod.ts";
import {
  TerminalSpinner,
  SpinnerTypes,
} from "https://deno.land/x/spinners/mod.ts";
import chalk from "npm:chalk@latest";
import { config } from "./config.ts";

const ask = new Ask();

const answers = await ask.prompt([
  {
    name: "useTs",
    message: "Do you wan't to use Typescript?",
    type: "confirm",
  },
  {
    name: "projectName",
    message: "What is the name of your project?",
    type: "input",
  },
]);

if (answers.useTs) {
  // Check if git is installed
  const checkGithubSpinner = new TerminalSpinner({
    text: "Checking if git is installed...",
    color: "green", // see colors in util.ts
    spinner: SpinnerTypes.arc,
    indent: 0,
    cursor: false,
    writer: Deno.stdout,
  });

  checkGithubSpinner.start();

  // find out if git is installed with `which git`
  const gitInstalled = await Deno.run({
    cmd: ["git", "--version"],
    stdout: "null",
    stderr: "null",
  }).status();

  if (gitInstalled.success) {
    checkGithubSpinner.succeed("Git is installed");

    // Clone the template
    const cloneSpinner = new TerminalSpinner({
      text: "Cloning template...",
      color: "green", // see colors in util.ts
      spinner: SpinnerTypes.arc,
      indent: 0,
      cursor: false,
      writer: Deno.stdout,
    });

    cloneSpinner.start();
    const github_url = config.templates.typescript;
    const projectName = answers.projectName;
    const clone = await Deno.run({
      cmd: ["git", "clone", `${github_url}`, `${projectName}`],
      stdout: "null",
      stderr: "null",
    }).status();

    if (clone.success) {
      cloneSpinner.succeed("Cloned template with success!");

      console.log(
        chalk.bold.green(
          `\n\nYour project is ready to go, run ${chalk.gray(
            "deno task dev"
          )} inside ./${chalk.gray(projectName)} to start the bot.\n`
        )
      );
    } else {
      cloneSpinner.fail("Failed to clone template.");
      Deno.exit(1);
    }
  } else {
    checkGithubSpinner.fail(
      "Git is not installed, make sure to install it first."
    );
    Deno.exit(1);
  }
} else {
  console.log(chalk.bold.yellow("\nJavaScript is not available right now.\n"));
}
