import React from 'react'
import Head from 'next/head'
import Container from '@material-ui/core/Container';
import AppBar from './AppBar'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: 10,
    }
}));

export default function Layout(props) {
    const { children } = props;
    const classes = useStyles();

    return (
        <div>
            <Head>
                <title>Futmondo Stats</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width"></meta>
            </Head>
            <AppBar {...props}></AppBar>
            <Container className={classes.root} maxWidth={false}>
                {children}
            </Container>
        </div >
    )
}