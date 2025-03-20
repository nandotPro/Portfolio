const contactContent = [
  { content: 'const contato = {', type: 'keyword' },
  { content: '  email: "meuemail@example.com",', type: 'property' },
  { content: '  whatsapp: "+55 99999-9999",', type: 'property' },
  { content: '  linkedin: "https://www.linkedin.com/in/meulinkedin/",', type: 'property' },
  { content: '  github: "https://github.com/meugit"', type: 'property' },
  { content: '};', type: 'bracket' },
  { content: '', type: 'normal' },
  { content: 'console.log("Se quiser me encontrar, pode me contatar por:");', type: 'method' },
  { content: 'Object.entries(contato).forEach(([chave, valor]) => console.log(`${chave}: ${valor}`));', type: 'method' },
];

export default contactContent; 