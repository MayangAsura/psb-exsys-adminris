import React from 'react';
import '../../../test-result.css'

const ExamResults = ({ examData }) => {
  // Format date to Indonesian format
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta'
    };
    return date.toLocaleDateString('id-ID', options);
  };

  if (!examData) {
    return <div>Loading data ujian...</div>;
  }

  const {
    full_name,
    school_name,
    questions,
    total_score,
    submit_at
  } = examData;

  return (
    <div className="exam-results-container">
      <div className="exam-header">
        <h1>Hasil Ujian Siswa</h1>
        <div className="student-info">
          <div className="info-row">
            <span className="label">Nama Siswa:</span>
            <span className="value">{full_name}</span>
          </div>
          <div className="info-row">
            <span className="label">Sekolah:</span>
            <span className="value">{school_name}</span>
          </div>
          <div className="info-row">
            <span className="label">Total Score:</span>
            <span className="value score-total">{total_score}</span>
          </div>
          <div className="info-row">
            <span className="label">Waktu Submit:</span>
            <span className="value">{formatDateTime(submit_at)}</span>
          </div>
        </div>
      </div>

      <div className="questions-list">
        <h2>Detail Jawaban</h2>
        {questions.map((question, index) => (
          <div key={question.id || index} className="question-item">
            <div className="question-header">
              <span className="question-number">Soal {index + 1}</span>
              <span className={`question-score ${question.is_correct ? 'correct' : 'wrong'}`}>
                Score: {question.score}
              </span>
            </div>
            
            <p className="question-text">{question.text}</p>
            
            <div className="options-list">
              {question.options.map((option, optIndex) => {
                const isCorrectAnswer = option.letter === question.correct_answer;
                const isStudentAnswer = option.letter === question.student_answer;
                let optionClass = 'option';
                
                if (isCorrectAnswer && isStudentAnswer) {
                  optionClass += ' correct-answer';
                } else if (isCorrectAnswer) {
                  optionClass += ' correct-answer';
                } else if (isStudentAnswer) {
                  optionClass += ' student-answer';
                }

                return (
                  <div key={optIndex} className={optionClass}>
                    <span className="option-letter">{option.letter}.</span>
                    <span className="option-text">{option.text}</span>
                    {isCorrectAnswer && !isStudentAnswer && (
                      <span className="answer-indicator">(Jawaban Benar)</span>
                    )}
                    {isStudentAnswer && !isCorrectAnswer && (
                      <span className="answer-indicator">(Jawaban Siswa)</span>
                    )}
                    {isCorrectAnswer && isStudentAnswer && (
                      <span className="answer-indicator">(Benar)</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example data structure for props
ExamResults.defaultProps = {
  examData: {
    siswa_full_name: "Ahmad Rizky",
    school_name: "SMA Negeri 1 Jakarta",
    total_score: 85,
    submit_at: "2024-01-15T14:30:00Z",
    questions: [
      {
        id: 1,
        text: "Apa ibukota Indonesia?",
        score: 10,
        correct_answer: "C",
        student_answer: "C",
        options: [
          { letter: "A", text: "Surabaya" },
          { letter: "B", text: "Bandung" },
          { letter: "C", text: "Jakarta" },
          { letter: "D", text: "Medan" }
        ]
      },
      {
        id: 2,
        text: "Planet terdekat dengan matahari adalah?",
        score: 0,
        correct_answer: "A",
        student_answer: "B",
        options: [
          { letter: "A", text: "Merkurius" },
          { letter: "B", text: "Venus" },
          { letter: "C", text: "Bumi" },
          { letter: "D", text: "Mars" }
        ]
      },
      {
        id: 3,
        text: "2 + 2 x 2 = ?",
        score: 10,
        correct_answer: "D",
        student_answer: "D",
        options: [
          { letter: "A", text: "6" },
          { letter: "B", text: "8" },
          { letter: "C", text: "10" },
          { letter: "D", text: "6 (dengan operasi yang benar)" }
        ]
      }
    ]
  }
};

export default ExamResults;