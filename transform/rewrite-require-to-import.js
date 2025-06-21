/**
 * jscodeshift transform: rewrite-require-to-import.js
 * Converts: const x = require('y') => import x from 'y'
 * Only for top-level requires, skips Node-only modules (fs, path, etc.)
 */

const nodeOnly = ['fs', 'path', 'os', 'http', 'https', 'child_process', 'stream', 'zlib', 'crypto', 'util', 'url', 'net', 'tls', 'dns', 'readline', 'repl', 'vm', 'worker_threads', 'perf_hooks', 'inspector', 'dgram', 'cluster', 'assert', 'buffer', 'timers', 'tty', 'domain', 'constants', 'module', 'process', 'v8'];

module.exports = function(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  let shouldSkip = false;

  // Find top-level require declarations
  root.find(j.VariableDeclaration)
    .filter(path => path.parent.value.type === 'Program')
    .forEach(path => {
      path.value.declarations.forEach(decl => {
        if (
          decl.init &&
          decl.init.type === 'CallExpression' &&
          decl.init.callee.name === 'require' &&
          decl.init.arguments.length === 1 &&
          decl.init.arguments[0].type === 'Literal'
        ) {
          const reqPath = decl.init.arguments[0].value;
          if (nodeOnly.includes(reqPath)) {
            shouldSkip = true;
          }
        }
      });
    });

  if (shouldSkip) return file.source;

  // Transform require to import
  root.find(j.VariableDeclaration)
    .filter(path => path.parent.value.type === 'Program')
    .forEach(path => {
      path.value.declarations.forEach(decl => {
        if (
          decl.init &&
          decl.init.type === 'CallExpression' &&
          decl.init.callee.name === 'require' &&
          decl.init.arguments.length === 1 &&
          decl.init.arguments[0].type === 'Literal'
        ) {
          const localName = decl.id.name;
          const reqPath = decl.init.arguments[0].value;
          // Replace with import
          j(path).insertBefore(
            j.importDeclaration(
              [j.importDefaultSpecifier(j.identifier(localName))],
              j.literal(reqPath)
            )
          );
          // Remove the original declaration
          j(decl).remove();
        }
      });
      // Remove empty variable declarations
      if (path.value.declarations.length === 0) {
        j(path).remove();
      }
    });

  return root.toSource({ quote: 'single' });
}; 