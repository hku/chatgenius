import React, { useEffect, useState } from 'react';
import './App.css';
import yaml from "js-yaml"
import { AppBar, Box, Button, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Toolbar, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import GitHubIcon from '@mui/icons-material/GitHub';
const _prefixes = `
- label: 文案优化助手
  prefix: "As a Chinese writing improvement assistant, your task is to improve the spelling, grammar, clarity, concision, and overall readability of the text provided, while breaking down long sentences, reducing repetition, and providing suggestions for improvement. Please provide only the corrected version of the text and avoid including explanations. Please begin by editing the following text:"
  tip: 请输入需要优化的文案
- label: 英文翻译助手
  prefix: "I want you to act as an English translator, spelling corrector and improver. I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in English. I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper level English words and sentences. Keep the meaning same, but make them more literary. I want you to only reply the correction, the improvements and nothing else, do not write explanations. My first sentence is:"
  tip: 请输入待翻译成英文的文本
- label: 爆款文章标题助手
  prefix: "I want you to act as a title generator for written pieces. I will provide you with the topic and key words of an article, and you will generate five attention-grabbing titles. Please keep the title concise and under 20 words, and ensure that the meaning is maintained. Replies will utilize the language type of the topic. My first topic is:"
  tip: 请输入文章的主题、关键词等信息
- label: 论文写作助手
  prefix: "Write a highly detailed essay with introduction, body, and conclusion paragraphs responding to the following:" 
  tip: 请输入你的问题
- label: Midjourney Prompt生成器
  prefix: "I want you to act as a prompt generator for Midjourney’s artificial intelligence program. Your job is to provide detailed and creative descriptions that will inspire unique and interesting images from the AI. Keep in mind that the AI is capable of understanding a wide range of language and can interpret abstract concepts, so feel free to be as imaginative and descriptive as possible. For example, you could describe a scene from a futuristic city, or a surreal landscape filled with strange creatures. The more detailed and imaginative your description, the more interesting the resulting image will be. Here is your first prompt: "
  tip: 请描述你想要的画面
- label: CEO公司决策助手
  prefix: "I want you to act as a Chief Executive Officer for a hypothetical company. You will be responsible for making strategic decisions, managing the company’s financial performance, and representing the company to external stakeholders. You will be given a series of scenarios and challenges to respond to, and you should use your best judgment and leadership skills to come up with solutions. Remember to remain professional and make decisions that are in the best interest of the company and its employees. Your first challenge is:"
  tip: 请输入公司面临的难题
- label: 产品经理助手
  prefix: "Please acknowledge my following request. Please respond to me as a product manager. I will ask for subject, and you will help me writing a PRD for it with these heders: Subject, Introduction, Problem Statement, Goals and Objectives, User Stories, Technical requirements, Benefits, KPIs, Development Risks, Conclusion. Do not write any PRD until I ask for one on a specific subject, feature pr development.The product is "
  tip: 请描述你想设计的产品
- label: DIY教程助手
  prefix: "I want you to act as a DIY expert. You will develop the skills necessary to complete simple home improvement projects, create tutorials and guides for beginners, explain complex concepts in layman’s terms using visuals, and work on developing helpful resources that people can use when taking on their own do-it-yourself project. My first suggestion request is "
  tip: 请描述你想完成的DIY项目
- label: 程序猿助手
  prefix: "I want you to act as a stackoverflow post. I will ask programming-related questions and you will reply with what the answer should be. I want you to only reply with the given answer, and write explanations when there is not enough detail. do not write explanations. When I need to tell you something in English, I will do so by putting text inside curly brackets {like this}. My first question is "  
  tip: 请输入你遇到的编程难题
- label: IT办公解答助手
  prefix: "I want you to act as an IT Expert. I will provide you with all the information needed about my technical problems, and your role is to solve my problem. You should use your computer science, network infrastructure, and IT security knowledge to solve my problem. Using intelligent, simple, and understandable language for people of all levels in your answers will be helpful. It is helpful to explain your solutions step by step and with bullet points. Try to avoid too many technical details, but use them when necessary. I want you to reply with the solution, not write any explanations. My first problem is "  
  tip: 请输入你遇到的IT办公问题
- label: Linux终端模拟器
  prefix: "I want you to act as a linux terminal. I will type commands and you will reply with what the terminal should show. I want you to only reply with the terminal output inside one unique code block, and nothing else. do not write explanations. do not type commands unless I instruct you to do so. When I need to tell you something in English, I will do so by putting text inside curly brackets {备注文本}. My first command is "  
  tip: 请输入Linux指令
`;

interface Prompt {
  label: string
  prefix: string
  tip: string
}

const prefixes = yaml.load(_prefixes) as Prompt[]

const sendMsg = async (value:string) => {
  //if match then send
  console.log(`value: ${value}`)
  const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});

  const response = await chrome.tabs.sendMessage(tab.id as number, {
      type: 'prompt',
      value
  });
  // do something with response here, not outside the function
  console.log(response);
}


const Navbar = () => {
  return (
  <AppBar position="static" sx={{
    marginBottom: '15px'
  }}>
  <Toolbar>
    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
      ChatGenius
    </Typography>
    <IconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label="menu"
      sx={{ mr: 2 }}
    >
      <GitHubIcon onClick={()=>{chrome.tabs.create({ url: 'https://github.com/hku/chatgenius' })}} />
    </IconButton>
  </Toolbar>
  </AppBar>
  )
}


const Selector = ({value=0, handleChange=(e:any)=>{}}) => {

  return <Paper elevation={6} sx={{margin:1}}>
  <FormControl fullWidth>
    <InputLabel id="demo-simple-select-label">助手类型</InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={value}
      label="Age"
      onChange={handleChange}
    >
      {prefixes.map((p, i: number)=> <MenuItem key={i} value={i}>{p.label}</MenuItem>)

      }
    </Select>
  </FormControl>
  </Paper>
}





function App() {
 const [value, setValue] = useState(0)
 const [prompt, setPrompt] = useState('')

 useEffect(()=>{

  const prefix = prefixes[value].prefix
  console.log(prefix)
 
}, [value])

const sumbitMsg = (msg:string, idx:number) => {
  const prefix = prefixes[idx].prefix
  const prompt = `${prefix} ${msg}`
  sendMsg(prompt)
}



  return (
    <div className="App">
      <Navbar></Navbar>
      <Box sx={{ minWidth: 120 }}>
        <Selector value={value} handleChange={e=>setValue(e.target.value)}/>
        
        <Paper elevation={6} sx={{margin:1}}>
            <TextField rows={2} fullWidth value={prompt}
            onChange = {
              e => {
                console.log(e.target.value)
                setPrompt(e.target.value)
              }
            }
            onKeyDown={
              e => {
                if(e.key === 'Enter') {
                  sumbitMsg(prompt, value)
                }
              }
            }
            placeholder={prefixes[value].tip}
            multiline={true} 
            variant="outlined"/>
        </Paper>
        <Paper elevation={6} sx={{margin:1}}>
          <Button variant="contained"sx={{width: '100%'}}  endIcon={<SendIcon />}
          onClick = {
            ()=>sumbitMsg(prompt, value)
          }
          >提交</Button>
        </Paper>
        <Paper elevation={6} sx={{
          fontSize:12,
          color: '#999',
          padding: 1,
          margin: 1
          }}>
        <p>使用方法</p>
        <p>1. 打开 <a href="https://chat.openai.com/chat" target="_blank">chatGPT网站</a></p>
        {/* <p>1. 打开 <span style={{textDecoration: 'underline', color:'#69f'}} onClick={()=>{chrome.tabs.create({ url: 'https://chat.openai.com/chat' })}}>chatGPT网站</span></p> */}
        <p>2. 选择“助手类型”</p>
        <p>3. 输入文本后，回车，或点击按钮</p>
        </Paper>

        {/* <Paper sx={{
          fontSize:12,
          color: '#999',
          padding: 1,
          maxHeight: 200,
          overflow: 'hidden',
          textOverflow : 'ellipsis' 
        }} elevation={6}>
          <span>{prefixes[value].prefix}</span></Paper> */}
      </Box>
    </div>
  );
}

export default App;
