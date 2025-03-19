// Conteúdo do arquivo contact.ts simulando um código TypeScript
const contactContent = [
  { content: 'const contato = {', type: 'keyword' },
  { content: '  email: "meuemail@example.com",', type: 'string' },
  { content: '  whatsapp: "+55 99999-9999",', type: 'string' },
  { content: '  linkedin: "https://www.linkedin.com/in/meulinkedin/",', type: 'string' },
  { content: '  github: "https://github.com/meugit"', type: 'string' },
  { content: '};', type: 'normal' },
  { content: '', type: 'normal' },
  { content: 'console.log("Se quiser me encontrar, pode me contatar por:");', type: 'keyword' },
  { content: 'Object.entries(contato).forEach(([chave, valor]) => console.log(`${chave}: ${valor}`));', type: 'normal' },
];

export default contactContent; 