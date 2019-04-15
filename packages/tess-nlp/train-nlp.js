/*
 * Copyright (c) AXA Shared Services Spain S.A.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const fs = require('fs');

module.exports = async function trainnlp(manager) {
  if (fs.existsSync('./model.nlp')) {
    manager.load('./model.nlp');
    return;
  }
  manager.addDocument('pt', 'mostre-me o calendário', 'nextWeekImage');
  manager.addDocument('pt', 'o calendário por favor', 'nextWeekImage');
  manager.addDocument('pt', 'o que vai acontecer essa semana', 'nextWeekImage');
  manager.addDocument('pt', 'essa semana', 'nextWeekImage');
  manager.addDocument('pt', 'quais os próximos eventos', 'nextWeekImage');
  const hrstart = process.hrtime();
  await manager.train();
  const hrend = process.hrtime(hrstart);
  console.info('Trained (hr): %ds %dms', hrend[0], hrend[1] / 1000000);

  manager.addAnswer('pt', 'nextWeekImage', "Um momento, vou verificar a agenda para você");
  
  manager.save('./model.nlp');
};
