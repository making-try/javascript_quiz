document.addEventListener('DOMContentLoaded',function(){
  const startBtn = document.getElementById('start_btn');
  const url = 'https://opentdb.com/api.php?amount=10';

  const shuffleAnswer = function(answers){
    for (let i = answers.length - 1; i >= 0; i--){
      let randomNum = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[randomNum]] = [answers[randomNum], answers[i]]
    }
    return answers;
  }

  const waitingMessage = function(){
    const titleElement = document.getElementById('title_name');
    const messageElement = document.getElementById('message_element');
    const selectBtn = document.getElementById('select_btn');

    while (titleElement.firstChild){
      titleElement.removeChild(titleElement.firstChild);
    };
    while (messageElement.firstChild){
      messageElement.removeChild(messageElement.firstChild);
    };
    while (selectBtn.firstChild){
      selectBtn.removeChild(selectBtn.firstChild);
    };
    const h1Anchor = document.createElement('h1');
    const h1Text = document.createTextNode('通信中....');
    h1Anchor.appendChild(h1Text);

    const pAnchor = document.createElement('p');
    const pText = document.createTextNode('少々お待ちください');
    pAnchor.appendChild(pText);

    titleElement.appendChild(h1Anchor);
    messageElement.appendChild(pAnchor);
  }

  const resultMessage = function(correctNum){
    const titleElement = document.getElementById('title_name');
    const messageElement = document.getElementById('message_element');
    const selectBtn = document.getElementById('select_btn');

    while (titleElement.firstChild){
      titleElement.removeChild(titleElement.firstChild);
    };
    while (messageElement.firstChild){
      messageElement.removeChild(messageElement.firstChild);
    };
    while (selectBtn.firstChild){
      selectBtn.removeChild(selectBtn.firstChild);
    };
    const h1Anchor = document.createElement('h1');
    const h1Text = document.createTextNode('あなたの正答数は' + correctNum + 'です！！！');
    h1Anchor.appendChild(h1Text);

    const pAnchor = document.createElement('p');
    const pText = document.createTextNode('再度チャレンジしたい場合は以下をクリック');
    pAnchor.appendChild(pText);

    titleElement.appendChild(h1Anchor);
    messageElement.appendChild(pAnchor);

    const homeBtnAnchor = document.createElement('input');
    homeBtnAnchor.id = 'homeBtn';
    homeBtnAnchor.type = 'button';
    homeBtnAnchor.value = 'ホームに戻る';
    selectBtn.appendChild(homeBtnAnchor);

    const homeBtn = document.getElementById('homeBtn');
    homeBtn.addEventListener('click',function(){
      location.reload();
    });
  }

  const awaitForClick = function(statusBtn){
    return new Promise(resolve => {
      statusBtn.addEventListener('click', resolve);
    });
  };

  const viewQuiz = function(quizNum, quizObj){
    let beforeShuffleAnswers = quizObj.incorrect_answers;
    // QUESTION: ↓ここでquizObjのincorrect_answersの配列要素が増えている。なぜでしょうか？
    //私としては、beforeShuffleAnswersに退避して処理しているつもりなのですが。
    beforeShuffleAnswers.push(quizObj.correct_answer)
    const afterShuffleAnswers = shuffleAnswer(beforeShuffleAnswers);
    const titleElement = document.getElementById('title_name');
    const messageElement = document.getElementById('message_element');
    const selectBtn = document.getElementById('select_btn');

    while (titleElement.firstChild){
      titleElement.removeChild(titleElement.firstChild);
    };
    while (messageElement.firstChild){
      messageElement.removeChild(messageElement.firstChild);
    };
    while (selectBtn.firstChild){
      selectBtn.removeChild(selectBtn.firstChild);
    };
    const h1Anchor = document.createElement('h1');
    const h1Text = document.createTextNode('問題' + quizNum);
    h1Anchor.appendChild(h1Text);

    const h2categoryAnchor = document.createElement('h2');
    const h2categoryText = document.createTextNode('[ジャンル]' + quizObj.category);
    h2categoryAnchor.appendChild(h2categoryText);

    const h2difficultyAnchor = document.createElement('h2');
    const h2difficultyText = document.createTextNode('[難易度]' + quizObj.difficulty);
    h2difficultyAnchor.appendChild(h2difficultyText);

    const pAnchor = document.createElement('p');
    const pText = document.createTextNode(quizObj.question);
    pAnchor.appendChild(pText);

    titleElement.appendChild(h1Anchor);
    titleElement.appendChild(h2categoryAnchor);
    titleElement.appendChild(h2difficultyAnchor);
    messageElement.appendChild(pAnchor);

    for (answer of afterShuffleAnswers){
      const answerBtnAnchor = document.createElement('input');
      answerBtnAnchor.id = 'statusBtn' + quizNum;
      answerBtnAnchor.type = 'button';
      answerBtnAnchor.value = answer;
      selectBtn.appendChild(answerBtnAnchor);
    }
  }

  //開始ボタン押下時のアクション
  startBtn.addEventListener('click',function(){

    waitingMessage();
    //非同期通信の開始
    fetch(url).then(function(response) {
      return response.json();
    }).then(async function(json) {
      const quizSet = JSON.parse(JSON.stringify(json));
      let quizNum = 0;
      let correctNum = 0;

      for (const quizObj of quizSet.results) {
        quizNum += 1;
        viewQuiz(quizNum, quizObj);
        const selectBtn = document.getElementById('select_btn');
        const result = await awaitForClick(selectBtn)
        if(quizObj.correct_answer === result.path[0].defaultValue){
          correctNum += 1;
        }
      }
      //正解発表
      resultMessage(correctNum);
    });
  });
})
