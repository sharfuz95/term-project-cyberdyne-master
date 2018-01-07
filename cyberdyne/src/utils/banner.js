import gradient from 'gradient-string';
import chalk from 'chalk';

const names = `
A project by:
John S. Bissonette, Aaron McClure, Fernando Parnes, Michael Pawlicki, Sharfuz Sihat

For CSC 210: Web Programming at the ${chalk
    .hex('#FFD100')
    .bgHex('#003B71')
    .bold.underline('University of Rochester')}

`;

const contributors = chalk.bold.greenBright.bgBlack(names);

const cyberdeeznuts = gradient([
  { color: '#ef8e38', pos: 0 },
  { color: '#282c54', pos: 0.6 },
  { color: '#04eebc', pos: 1 },
]);

// prettier-ignore
const banner = `
 ██████╗██╗   ██╗██████╗ ███████╗██████╗ ██████╗ ██╗   ██╗███╗   ██╗███████╗
██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝████╗  ██║██╔════╝
██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝██║  ██║ ╚████╔╝ ██╔██╗ ██║█████╗
██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗██║  ██║  ╚██╔╝  ██║╚██╗██║██╔══╝
╚██████╗   ██║   ██████╔╝███████╗██║  ██║██████╔╝   ██║   ██║ ╚████║███████╗
 ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═════╝    ╚═╝   ╚═╝  ╚═══╝╚══════╝
`;

const logo = cyberdeeznuts(banner, { interpolation: 'hsv' });

export { contributors, logo };
