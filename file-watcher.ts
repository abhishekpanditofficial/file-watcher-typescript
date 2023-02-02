import fs from 'fs';
import { exec } from 'child_process';

export function fileWatcher(directories: string[], fileTypes: string[]): void {
  directories.forEach(directory => {
    fs.watch(directory, { recursive: true }, (eventType: string, filename: string) => {
      if (eventType === 'change') {
        const extension = filename.split('.').pop();
        if (extension && fileTypes.includes(extension)) {
          console.log(`File ${filename} with ${extension} extension changed.`);
          exec('killall node', (err, stdout, stderr) => {
            if (err) {
              console.error(`Error while killing node process: ${err}`);
              return;
            }
            exec('npm run start', { stdio: 'inherit', shell: true }, (err, stdout, stderr) => {
              if (err) {
                console.error(`Error while starting node process: ${err}`);
              }
            });
          });
        }
      }
    });
  });
}
