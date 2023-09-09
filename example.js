const vscode = require('vscode');
You can get the document symbols by running 'vscode.executeDocumentSymbolProvider'.

Here's an example that executes the command on the active document, and then converts the nested list of symbols (each DocumentSymbol can have children) into a flat list filtered by SymbolKind.Variable:

function findVars(symbols: vscode.DocumentSymbol[]): vscode.DocumentSymbol[] {
  var vars =
      symbols.filter(symbol => symbol.kind === vscode.SymbolKind.Variable);
  return vars.concat(symbols.map(symbol => findVars(symbol.children))
                         .reduce((a, b) => a.concat(b), []));
}
var activeEditor = vscode.window.activeTextEditor;
if (activeEditor !== undefined) {
  vscode.commands
      .executeCommand<vscode.DocumentSymbol[]>(
          'vscode.executeDocumentSymbolProvider', activeEditor.document.uri)
      .then(symbols => {
        if (symbols !== undefined) {
          for (const variable of findVars(symbols)) {
            console.log(variable.name);
          }
        }
      });
}
function activatex(context) {
    context.subscriptions.push(
        vscode.languages.registerDefinitionProvider('javascript', {
            provideDefinition(document, position, token) {
                const wordRange = document.getWordRangeAtPosition(position);
                const word = document.getText(wordRange);
                if (word === 'test') {
                    const definitionPosition = new vscode.Position(0, 0);
                    return new vscode.Location(document.uri, definitionPosition);
                }
            }
        })
    );
}
exports.activate = activate;



let editor = window.activeTextEditor;
if (editor) {
    let document = editor.document;
    let languageId = document.languageId;
    let languageFeatures = extensions.getExtension('vscode.' + languageId + '-language-features');
    if (languageFeatures) {

        let api = languageFeatures.exports;
        if (api && api.getVariableDefinitionProvider) {
          
      let provider = languageFeatures.exports.getVariableDefinitionProvider();
      if (provider) {
          provider.parseVariable(document).then((variableDefinitions) => {
              // Process the variable definitions
              console.log(variableDefinitions);
          });
      }
      

            api.getVariableDefinition(document.uri, editor.selection.start).then((definition) => {
                if (definition) {
                    window.showInformationMessage(`Variable definition: ${definition}`);
                } else {
                    window.showInformationMessage('No variable definition found.');
                }
            }, (error) => {
                window.showErrorMessage(`Error: ${error}`);
            });
        } else {
            window.showErrorMessage('The language features extension does not support getting variable definitions.');
        }
    } else {
        window.showErrorMessage(`No language features extension found for ${languageId} language.`);
    }
} else {
    window.showErrorMessage('No active text editor found.');
}



export  async function findVariableDefinition( variableName:string) {
    // 获取当前活动文档
    const mdocument = window.activeTextEditor?.document;
    // 获取 TypeScript 语言服务 set type to any
    let tsLanguageService : any;
  
     // 解析语法树
     let sourceFile = ts.createSourceFile(fileName, document.getText(), ts.ScriptTarget.ES2015, true);
  
     // 遍历语法树，查找变量定义
     ts.forEachChild(sourceFile, node => {
         if (ts.isVariableStatement(node)) {
             node.declarationList.declarations.forEach(declaration => {
                 if (ts.isIdentifier(declaration.name)) {
                     let variableName = declaration.name.text;
                     let variableType = ts.SyntaxKind[declaration.type.kind];
                     window.showInformationMessage(`变量名：${variableName}，类型：${variableType}`);
                 }
             });
         }
     });
  
    try{
      const export1 = extensions.getExtension('vscode.'+mdocument?.languageId+'-language-features').exports;
      tsLanguageService = export1.getAPI(0)  as any;
      // 获取文档中所有符号
      const symbols = await tsLanguageService.getDocumentSymbols(mdocument);
      // 查找变量定义
      for (const symbol of symbols) {
          if (symbol.name === variableName && symbol.kind === tsLanguageService.SymbolKind.Variable) {
              // 获取定义的位置和文本片段
              const position = symbol.selectionRange.start;
              const lineText = mdocument.lineAt(position.line).text.trim();
              console.log(`Found definition in file: ${mdocument.fileName}, line: ${position.line + 1}, text: ${lineText}`);
          }
      }
    }catch(e){
      console.log(e)
    }
   
  }

  

export function activatex(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.parseSyntax', () => {
        let editor = vscode.window.activeTextEditor;
        if (editor) {
            let document = editor.document;
            vscode.languages.parseSyntax(document).then((syntaxTree) => {
                // Process the syntax tree
                console.log(syntaxTree);
            });
        }
    });

class MLWDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    public provideDocumentSymbols(document: vscode.TextDocument,
            token: vscode.CancellationToken): Thenable<vscode.SymbolInformation[]> {
        return new Promise((resolve, reject) => {
    
          // that's the important variable. It must be a multidimensional array, one dimension for each level you need to display.
          let symbols = [];
    
          let icon_main = vscode.SymbolKind.Class;
          let icon_second = vscode.SymbolKind.Field;
          let icon_third = vscode.SymbolKind.String;
    
          // check each line of the document about your keywords
          for (let i = 0; i < document.lineCount; i++) {
            let line = document.lineAt(i);
            if(line.text.trim().startsWith("WORD")) {
              symbols.push(new vscode.DocumentSymbol("Level 1: WORD", document.lineAt(i+1).text.trim(), icon_main, line.range, line.range ));
            } /* elses for the levels below */
           }
    
          resolve(symbols);
            });
        }
