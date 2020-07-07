import chalk from 'chalk';
import path from 'path';
import { execSync } from 'child_process';
import { generateProject } from './generator';

const PROGRAM_NAME = 'create-goji-app';

const shouldUseYarn = () => {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
};

const TARGETS = ['wechat', 'baidu', 'alipay', 'toutiao', 'qq', 'toutiao'];

const main = async () => {
  const argv = process.argv.slice(2);
  if (!argv.length) {
    console.error('Please specify the project directory:');
    console.log(`  ${chalk.cyan(PROGRAM_NAME)} ${chalk.green('<project-directory>')}`);
    console.log();
    console.log('For example:');
    console.log(`  ${chalk.cyan(PROGRAM_NAME)} ${chalk.green('my-goji-app')}`);
    process.exit(1);
  }
  const [projectName] = argv;
  const destPath = path.join(process.cwd(), projectName);
  await generateProject(projectName, path.join(__dirname, '../../templates'), destPath);

  const installCommand = shouldUseYarn() ? 'yarn' : 'npm install';
  const runCommand = shouldUseYarn() ? 'yarn' : 'npm run';

  console.log(`Success! Created ${projectName} at ${destPath}`);
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan(`  ${runCommand} start [target]`));
  console.log('    Start Goji in development mode');
  console.log();
  console.log(chalk.cyan(`  ${runCommand} build [target]`));
  console.log('    Start Goji in production mode');
  console.log();
  console.log(
    `The ${chalk.cyan('[target]')} could be one of ${TARGETS.map(target => chalk.cyan(target)).join(
      ' / ',
    )}`,
  );
  console.log();
  console.log('We suggest that you begin by typing: ');
  console.log();
  console.log(chalk.cyan(`   cd ${projectName}`));
  console.log(chalk.cyan(`   ${installCommand}`));
};

main().catch(console.error);
