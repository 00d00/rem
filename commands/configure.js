import discord from 'discord.js';
import luaparse from 'luaparse';

export default {
  data: new discord.SlashCommandBuilder()
    .setName('configure')
    .setDescription('configure...')
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.Administrator)
  ,
  async execute(interaction) {


const luaScript = `
  -- Sample Lua script
  local str1 = "Hello, Lua!"
  local str2 = 'This is another Lua string.'

  function printStrings()
    print(str1)
    print(str2)
  end

  printStrings()
`;

const ast = luaparse.parse(luaScript, { locations: true });

function extractStringsFromAST(node) {
  if (node.type === 'StringLiteral') {
    console.log(`String: ${node.value}`);
  }
console.log('AH')
  if (node.type === 'Chunk' || node.type === 'FunctionDeclaration') {
    for (const key in node) {
      if (node[key] && typeof node[key] === 'object') {
        extractStringsFromAST(node[key]);
      }
    }
  }
}

extractStringsFromAST(ast);
  }
};
