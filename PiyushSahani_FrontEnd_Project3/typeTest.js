class StartApp {
  constructor() {
    this.model = new Model()
    this.view = new View()
    this.app = new Controller(this.model, this.view)
    if (!this._instance) {
      this._instance = this
    }
    return this._instance
  }
}

let instance = new StartApp()

window.addEventListener('DOMContentLoaded', instance, false)

function Model() {
  this.errorCount = 0
  this.extraCharCount = 0
  this.correctCharCount = 0
  this.incorrectWords = new Set()
  this.textData = `Lorem ipsum dolor sit amet consectetur adipisicing elit Aut assumenda ratione excepturi eos voluptate deleniti dolore maiores volupta tenetur recusandae debitis consequuntur laborum Ipsum facere minus animi corporis Totam rem Lorem ipsum dolor sit amet consectetur adipisicing elit Aut assumenda ratione excepturi eos voluptate deleniti dolore maiores volupta tenetur recusandae debitis consequuntur laborum Ipsum facere minus animi Lorem ipsum dolor sit amet consectetur adipisicing elit Aut assumenda ratione excepturi eos voluptate deleniti dolore maiores volupta tenetur recusandae debitis consequuntur laborum Ipsum facere minus animi corporis Totam rem Lorem ipsum dolor sit amet consectetur adipisicing elit Aut assumenda ratione excepturi eos voluptate deleniti dolore maiores volupta tenetur recusandae debitis consequuntur laborum Ipsum facere minus animi corporis Totam rem Lorem ipsum dolor sit amet consectetur adipisicing elit Aut assumenda ratione excepturi eos voluptate deleniti dolore maiores volupta tenetur recusandae debitis consequuntur laborum Ipsum facere minus animi corporis Totam rem Lorem ipsum dolor sit amet consectetur adipisicing elit Aut assumenda ratione excepturi eos voluptate deleniti dolore maiores volupta tenetur recusandae debitis consequuntur laborum Ipsum facere minus animi corporis Totam rem corporis Totam rem Lorem ipsum dolor sit amet consectetur adipisicing elit Aut assumenda ratione excepturi eos voluptate deleniti dolore maiores volupta tenetur recusandae debitis consequuntur laborum Ipsum facere minus animi corporis Totam rem Lorem ipsum dolor sit amet consectetur adipisicing elit Aut assumenda ratione excepturi eos voluptate deleniti dolore maiores volupta tenetur recusandae debitis consequuntur laborum Ipsum facere minus animi corporis Totam rem`
  this.currentCharIndex = 0
  this.currentWordIndex = 0

  this.resultObj = {
    errorCount: 0,
    accuracy: 0,
    incorrectWords: 0,
    WPM: 0,
    CPM: 0,
  }

  this.textDataArray = this.textData.split(' ')
  this.letterDataArray = []
  this.textData.split('').forEach((word) => {
    let letterArray = word.split('')
    letterArray.forEach((letter) => {
      this.letterDataArray.push(letter)
    })
  })

  this.totalCharacters = this.letterDataArray.length
  this.totalWords = this.textDataArray.length
  this.totalSkippedCharacters = 0
  this.totalCharactersEncountered = 0
  this.islastValueCorrect = (lastValueInput, letterFromText) => {
    if (lastValueInput !== letterFromText) {
      this.errorCount++
      this.OnErrorTriggerd(this.errorCount)
      this.incorrectWords.add(this.currentWordIndex)
    } else {
      this.correctCharCount++
    }
    return lastValueInput === letterFromText
  }

  this.OnUserTextInput = (lastValue) => {
    console.log(
      `this.errorCount : ${this.errorCount - this.extraCharCount},
      this.extraCharCount : ${this.extraCharCount},
      this.totalCharactersEncountered : ${this.totalCharactersEncountered},
      this.correctCharCount : ${this.correctCharCount},`

      // this.errorCount > 0
      //   ? (this.errorCount / this.totalCharactersEncountered) * 100
      //   : 100,
      // this.incorrectWords.size,
      // this.currentWordIndex - this.incorrectWords.size + 1,
      // this.correctCharCount
    )
    if (lastValue.keyCode >= 65 && lastValue.keyCode <= 90) {
      if (
        // if the user has not completed the word
        this.currentCharIndex < this.textDataArray[this.currentWordIndex].length
      ) {
        this.ActiveCharCorrect(
          this.currentWordIndex,
          this.currentCharIndex,
          this.islastValueCorrect(
            lastValue.key,
            this.textDataArray[this.currentWordIndex][this.currentCharIndex]
          )
        )
        this.totalCharactersEncountered++
        this.currentCharIndex++
      } else {
        // if the user has completed the word but not pressed space, so it keeps adding to the error
        this.extraCharCount++
        this.islastValueCorrect(
          lastValue.key,
          this.textDataArray[this.currentWordIndex][this.currentCharIndex]
        )
      }
    } else if (lastValue.keyCode === 32) {
      let noOfSkippedCharacter = 0
      if (this.currentCharIndex > 0) {
        // allow user to skip the word only if they have input atleast one character of the word
        if (
          this.textDataArray[this.currentWordIndex].length !==
          this.currentCharIndex // if the user has not entered all the characters and skipped
        ) {
          for (
            let i = this.currentCharIndex;
            i < this.textDataArray[this.currentWordIndex].length;
            i++
          ) {
            this.islastValueCorrect(
              lastValue.key,
              this.textDataArray[this.currentWordIndex][i]
            )
            noOfSkippedCharacter++
          }
        }

        this.totalSkippedCharacters += noOfSkippedCharacter
        this.totalCharactersEncountered += noOfSkippedCharacter
        this.currentWordIndex++
        this.currentCharIndex = 0
        this.noOfSkippedCharacter = 0

        this.ChangeLastWordStatus(
          this.currentWordIndex,
          noOfSkippedCharacter > 0
            ? false
            : !this.incorrectWords.has(this.currentWordIndex - 1)
        )
      } else lastValue.preventDefault()
    } else lastValue.preventDefault()
  }

  this.SetTextDataHandler = (handler) => {
    handler(this.letterDataArray)
  }

  this.ChangeLastWordStatusHandler = (handler) => {
    this.ChangeLastWordStatus = handler
  }

  this.SetCurrentActiveCharHandler = (handler) => {
    this.ActiveCharCorrect = handler
  }

  this.OnUserClickOnInputBar = () => {
    let time = new Date()
    let startTime = time.getSeconds()
    let countDown = 0
    let minutesElapsed = 0

    const timerInterval = setInterval(() => {
      let time = new Date()
      let diff = Math.abs(startTime - time.getSeconds())
      countDown++
      this.UpdateTimeCounter(countDown)

      if (diff >= 60 || countDown >= 60) {
        minutesElapsed++
      }

      if (minutesElapsed === 1) StopTimer()
    }, 1000)

    const StopTimer = () => {
      clearInterval(timerInterval)

      this.resultObj = {
        errorCount: this.errorCount,
        accuracy:
          this.correctCharCount === 0
            ? 0
            : this.errorCount > 0
            ? 100 -
              ((this.errorCount - this.extraCharCount) /
                this.totalCharactersEncountered) *
                100
            : 100,
        incorrectWords: this.incorrectWords.size,
        WPM: this.currentWordIndex - this.incorrectWords.size + 1,
        CPM: this.correctCharCount,
      }

      this.StopTimerfromController(this.resultObj)
    }
  }

  this.SetErrorCounterHandler = (handler) => {
    this.OnErrorTriggerd = handler
  }

  this.UpdateTimeCounterHandler = (handler) => {
    this.UpdateTimeCounter = handler
  }

  this.ShowResultHandler = (handler) => {
    this.StopTimerfromController = handler
  }
}

function View() {
  this.SetElement = (tag, className) => {
    let element = document.createElement(tag)
    if (className) element.classList.add(className)
    return element
  }

  this.GetElement = (selector) => {
    let element = document.querySelector(selector)
    return element
  }

  this.textDataElement = this.GetElement('#textData')
  this.inputTextElement = this.GetElement('#inputText')
  this.textWrapper = this.GetElement('.textDataClass')
  this.errorCounter = this.GetElement('.errorCounter')
  this.timeCounter = this.GetElement('.countdown')
  this.reportGroupElement = this.GetElement('.report')
  this.reportWPM = this.GetElement('#reportWPM')
  this.reportCPM = this.GetElement('#reportCPM')
  this.reportAccuracy = this.GetElement('#reportAccuracy')
  this.reportError = this.GetElement('#reportError')
  this.reportIncorrectWords = this.GetElement('#reportIncorrectWords')
  this.restartButton = this.GetElement('.restart')

  this.SetTextDataFromView = (textData) => {
    for (let i = 0; i < textData.length; i++) {
      let tempWordElement = this.SetElement('div', 'wordClass')
      this.textDataElement.append(tempWordElement)
      while (textData[i] !== ' ' && i < textData.length) {
        let tempLetterElement = this.SetElement('div', 'letterClass')
        tempLetterElement.innerText = textData[i]
        tempWordElement.append(tempLetterElement)
        i++
      }
    }
  }

  this.OnUserInputTextHandler = (inputHandler) => {
    this.inputTextElement.addEventListener('keydown', updateValue)
    function updateValue(e) {
      inputHandler(e)
    }
  }

  this.SetLastWordStatus = (activeWordIndex, isCorrect) => {
    let prevWord = undefined
    if (activeWordIndex > 0) {
      prevWord = this.textWrapper.childNodes[activeWordIndex - 1]
      isCorrect
        ? prevWord.classList.add('correctWord')
        : prevWord.classList.add('errorWord')
    }
  }

  this.SetCurrentActiveChar = (activeWordIndex, activeCharIndex, isCorrect) => {
    let currWord = this.textWrapper.childNodes[activeWordIndex]
    let currChar =
      this.textWrapper.childNodes[activeWordIndex].childNodes[activeCharIndex]
    let MarkWrong = (currChar, currWord) => {
      {
        currChar.classList.add('charWrong')
        currWord.classList.add('errorWord')
      }
    }
    isCorrect
      ? currChar.classList.add('charCorrect')
      : MarkWrong(currChar, currWord)
  }

  this.OnUserClickOnInputBarHandler = (inputHandler) => {
    let callBack = (e) => {
      inputHandler(e)
      this.inputTextElement.removeEventListener('click', callBack)
    }
    this.inputTextElement.addEventListener('click', callBack)
  }

  this.SetErrorCounter = (errorCount) => {
    this.errorCounter.innerText = errorCount
  }

  this.UpdateTimer = (countDown) => {
    this.timeCounter.innerText = countDown
  }

  this.StopTimer = (resultObject) => {
    this.inputTextElement.disabled = true
    this.inputTextElement.style.display = 'none'
    this.reportGroupElement.style.display = 'flex'
    this.restartButton.style.display = 'block'
    this.reportWPM.innerText = resultObject.WPM
    this.reportCPM.innerText = resultObject.CPM
    this.reportAccuracy.innerText = resultObject.accuracy.toFixed(2) + '%'
    this.reportIncorrectWords.innerText = resultObject.incorrectWords
  }
}

function Controller(model, view) {
  this.model = model
  this.view = view

  this.OnUserTextInput = (lastValue) => {
    this.model.OnUserTextInput(lastValue)
  }

  this.OnUserClickOnInputBar = () => {
    this.model.OnUserClickOnInputBar()
    this.ChangeLastWordStatus(this.model.currentWordIndex)
  }

  this.SetTextData = (textData) => {
    this.view.SetTextDataFromView(textData)
  }

  this.ChangeLastWordStatus = (activeWordIndex, isCorrect) => {
    this.view.SetLastWordStatus(activeWordIndex, isCorrect)
  }

  this.ActiveCharCorrect = (activeWordIndex, activeCharIndex, isCorrect) => {
    this.view.SetCurrentActiveChar(activeWordIndex, activeCharIndex, isCorrect)
  }

  this.OnErrorTriggerd = (errorCount) => {
    this.view.SetErrorCounter(errorCount)
  }

  this.UpdateTimeCounter = (countDown) => {
    this.view.UpdateTimer(countDown)
  }

  this.StopTimerfromController = (resultObject) => {
    this.view.StopTimer(resultObject)
  }

  this.view.OnUserClickOnInputBarHandler(this.OnUserClickOnInputBar)
  this.view.OnUserInputTextHandler(this.OnUserTextInput)
  this.view.restartButton.addEventListener('click', () => location.reload())

  this.model.SetTextDataHandler(this.SetTextData)
  this.model.ChangeLastWordStatusHandler(this.ChangeLastWordStatus)
  this.model.SetCurrentActiveCharHandler(this.ActiveCharCorrect)
  this.model.SetErrorCounterHandler(this.OnErrorTriggerd)
  this.model.UpdateTimeCounterHandler(this.UpdateTimeCounter)
  this.model.ShowResultHandler(this.StopTimerfromController)
}

// console.log(
//   this.textWrapper.childNodes[this.currentWordIndex].childNodes[
//     this.currentCharIndex
//   ],

//   lastValue.key ===
//     this.textWrapper.childNodes[this.currentWordIndex].childNodes[
//       this.currentCharIndex
//     ].innerText
// )

//?? One time call at the beginning ??//
// this.ChangeLastWordStatus(this.model.currentWordIndex)
// this.ActiveCharCorrect(
//   this.model.currentWordIndex,
//   this.model.currentCharIndex,
//   isCorrect
// )
