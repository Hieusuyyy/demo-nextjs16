'use client'

import React, {useState} from 'react'

export const BookEvent = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  }

  return (
    <div id={"book-event"}>
      {submitted ? (
        <p className={"text-sm"}>Thank you for booking this event!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor={"email"} className={"text-sm font-medium"}>Email address</label>
            <input
              type={"email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id={"email"}
              placeholder={"Enter your email"}
            />
          </div>

          <button type={"submit"} className={"button-submit"}>Book this event</button>
        </form>
      )}
    </div>
  )
}
