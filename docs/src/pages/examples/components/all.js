import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import styles from '../examples.module.css'

export default function AllExample({}) {

  const [routes, setRoutes] = useState({});

    const buttons = useRef(null);
    const output = useRef(null);

    useEffect(async () => {
      buttonRef = buttons.current
      outputRef = output.current
    });

    useEffect(() => {


    }, [])
  
    return (
      <header className={clsx('hero hero--primary')}>
        <div className="container">
          <h1 className="hero__title">Test (pending...)</h1>
          <div className={styles.terminal}><span ref={output}></span></div>
        </div>
      </header>
    );
  }
  