import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBarUi from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import GitHubIcon from '@material-ui/icons/GitHub';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Icon } from '@iconify/react';
import medalIcon from '@iconify/icons-mdi/medal';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Hidden from '@material-ui/core/Hidden';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    offset: {
        ...theme.mixins.toolbar,
        flexGrow: 1,
    },
    labelIcon: {
        minHeight: 64,
        paddingTop: 4,
    },
    '@global': {
        '.MuiTab-labelIcon .MuiTab-wrapper > *:first-child': {
            marginBottom: 0,
        }
    }
}));

function HideOnScroll(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
        threshold: 50,
    });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func,
};

export default function AppBar(props) {
    const classes = useStyles();

    return <>
        <div className={classes.root}>
            <HideOnScroll {...props}>
                <AppBarUi position="fixed">
                    <Toolbar>
                        <Typography variant="h6">
                            Futmondo FIC
                            </Typography>
                        <Hidden smDown>
                            <Tabs value={props.tab}>
                                <Link href="/">
                                    <Tab selected={props.tab == 0} className={classes.labelIcon} label={
                                        <>
                                            <Icon className={'MuiSvgIcon-root'} height={24} icon={medalIcon} />
                                        Puntos
                                    </>
                                    } />
                                </Link>
                                <Link href="/clauses">
                                    <Tab className={classes.labelIcon}
                                        selected={props.tab == 1}
                                        icon={<AttachMoneyIcon />}
                                        label="Mercado" />
                                </Link>
                            </Tabs>
                        </Hidden>
                        <Hidden mdUp>
                            <Tabs value={props.tab}>
                                <Link href="/">
                                    <Tab selected={props.tab == 0} label={
                                        <Icon className={'MuiSvgIcon-root'} height={24} icon={medalIcon} />
                                    } />
                                </Link>
                                <Link href="/clauses">
                                    <Tab className={classes.labelIcon}
                                        selected={props.tab == 1}
                                        icon={<AttachMoneyIcon />} />
                                </Link>
                            </Tabs>
                        </Hidden>
                        <div className={classes.root} />
                        <IconButton color="inherit" href="https://github.com/javiergonzalezotero/futmondo-stats" target="_blank" rel="noopener">
                            <GitHubIcon ></GitHubIcon>
                        </IconButton>
                    </Toolbar>
                </AppBarUi>
            </HideOnScroll>
        </div>
        <div className={classes.offset} />
    </>
}