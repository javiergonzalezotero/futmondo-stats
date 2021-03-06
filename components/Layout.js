import React from 'react'
import Head from 'next/head'
import Container from '@material-ui/core/Container';
import AppBar from './AppBar'
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: 10,
    },
    footer: {
        textAlign: 'center'
    },
    footerHeart: {
        color: red.A400
    }
}));

export default function Layout(props) {
    const { children } = props;
    const classes = useStyles();

    return (
        <div>
            <Head>
                <title>Futmondo FIC Stats</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width"></meta>
                <meta name="description" content="Pequeño resumen de la temporada Futmondo FIC" />
                <meta name="twitter:title" content="Futmondo FIC Stats" />
                <meta property="og:description" content="Pequeño resumen de la temporada Futmondo FIC" />
                <meta property="og:title" content="Futmondo FIC Stats" />
                <meta name="twitter:description" content="Pequeño resumen de la temporada Futmondo FIC" />
            </Head>
            <AppBar {...props}></AppBar>
            <Container className={classes.root} maxWidth={false}>
                {children}
            </Container>
            <footer>
                <div className={classes.footer}>
                    Hecho con <span className={classes.footerHeart}><b>♥</b></span>
                </div>
            </footer>
        </div >
    )
}