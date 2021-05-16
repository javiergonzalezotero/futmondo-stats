import Head from 'next/head'
import Link from 'next/link'
import Container from '@material-ui/core/Container';

export default function Layout({ children }) {
    return (
        <div>
            <Head>
                <title>Futmondo Stats</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            </Head>
            <Container maxWidth={false}>
                {children}
            </Container>
        </div>
    )
}