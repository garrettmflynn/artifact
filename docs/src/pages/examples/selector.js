import React from 'react';
import clsx from 'clsx';
import styles from './examples.module.css';
import { useHistory } from 'react-router';
import AllExample from './components/all';

export default function ExampleSelector({server, endpoints, router, id}) {
   const history = useHistory();
    var url = window.location;
    var name = new URLSearchParams(url.search).get('name');
    const [example, setExample] = React.useState(name ?? 'test');


    const renderExample = (name) => {
        switch(name) {
          case 'test':
            return <AllExample
            server={server}
            router={router}
            endpoints={endpoints}
          />
        }
      }

    const set = (name) => {
      history.replace(`/examples?name=${name}`)
      setExample(name)
    }
  
    return (
        <>
      <nav className={clsx(styles.nav)}>
        <button onClick={() => set('test')}>
          Test
        </button>
        </nav>

        <header>
            {renderExample(example)}
        </header>
        </>
    );
  }
  