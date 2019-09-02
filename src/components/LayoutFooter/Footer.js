/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import Container from 'components/Container';
import ExternalFooterLink from './ExternalFooterLink';
import FooterLink from './FooterLink';
import FooterNav from './FooterNav';
import MetaTitle from 'templates/components/MetaTitle';
import SectionLinks from './SectionLinks';
import React from 'react';
import {colors, media} from 'theme';
import {sectionListCommunity, sectionListDocs} from 'utils/sectionList';

// $FlowFixMe
import navFooter from '../../../content/footerNav.yml';

import ossLogoPng from 'images/oss_logo.png';

const Footer = ({layoutHasSidebar = false}: {layoutHasSidebar: boolean}) => (
  <footer
    css={{
      backgroundColor: colors.darker,
      color: colors.white,
      paddingTop: 10,
      paddingBottom: 50,

      [media.size('sidebarFixed')]: {
        paddingTop: 40,
      },
    }}>
    <Container>
      <div
        css={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',

          [media.between('small', 'medium')]: {
            paddingRight: layoutHasSidebar ? 240 : null,
          },

          [media.between('large', 'largerSidebar')]: {
            paddingRight: layoutHasSidebar ? 280 : null,
          },
          [media.between('largerSidebar', 'sidebarFixed', true)]: {
            paddingRight: layoutHasSidebar ? 380 : null,
          },
        }}>
        <div
          css={{
            flexWrap: 'wrap',
            display: 'flex',

            [media.lessThan('large')]: {
              width: '100%',
            },
            [media.greaterThan('xlarge')]: {
              width: 'calc(100% / 3 * 2)',
              paddingLeft: 40,
            },
          }}>
          <FooterNav layoutHasSidebar={layoutHasSidebar}>
<<<<<<< HEAD
            <MetaTitle onDark={true}>文档</MetaTitle>
=======
            <MetaTitle onDark={true}>{navFooter.docs.title}</MetaTitle>
>>>>>>> 941f54180ef5e652221f54ef6d1f6f2e9e063597
            {sectionListDocs.map(section => {
              const defaultItem = section.items[0];
              return (
                <FooterLink
                  to={`/docs/${defaultItem.id}.html`}
                  key={section.title}>
                  {section.title}
                </FooterLink>
              );
            })}
          </FooterNav>
          <FooterNav layoutHasSidebar={layoutHasSidebar}>
<<<<<<< HEAD
            <MetaTitle onDark={true}>Channels</MetaTitle>
            <ExternalFooterLink
              href="https://github.com/facebook/react"
              target="_blank"
              rel="noopener">
              GitHub
            </ExternalFooterLink>
            <ExternalFooterLink
              href="https://stackoverflow.com/questions/tagged/reactjs"
              target="_blank"
              rel="noopener">
              Stack Overflow
            </ExternalFooterLink>
            <ExternalFooterLink
              href="https://reactjs.org/community/support.html#popular-discussion-forums"
              target="_blank"
              rel="noopener">
              Discussion 论坛
            </ExternalFooterLink>
            <ExternalFooterLink
              href="https://discord.gg/0ZcbPKXt5bZjGY5n"
              target="_blank"
              rel="noopener">
              Reactiflux 聊天室
            </ExternalFooterLink>
            <ExternalFooterLink
              href="https://dev.to/t/react"
              target="_blank"
              rel="noopener">
              DEV 社区
            </ExternalFooterLink>
            <ExternalFooterLink
              href="https://www.facebook.com/react"
              target="_blank"
              rel="noopener">
              Facebook
            </ExternalFooterLink>
            <ExternalFooterLink
              href="https://twitter.com/reactjs"
              target="_blank"
              rel="noopener">
              Twitter
            </ExternalFooterLink>
          </FooterNav>
          <FooterNav layoutHasSidebar={layoutHasSidebar}>
            <MetaTitle onDark={true}>社区</MetaTitle>
=======
            <MetaTitle onDark={true}>{navFooter.channels.title}</MetaTitle>
            <SectionLinks links={navFooter.channels.items} />
          </FooterNav>
          <FooterNav layoutHasSidebar={layoutHasSidebar}>
            <MetaTitle onDark={true}>{navFooter.community.title}</MetaTitle>
            <ExternalFooterLink
              href={`https://github.com/facebook/react/blob/master/CODE_OF_CONDUCT.md`}>
              Code of Conduct
            </ExternalFooterLink>
>>>>>>> 941f54180ef5e652221f54ef6d1f6f2e9e063597
            {sectionListCommunity.map(section => (
              <FooterLink
                to={`/community/${section.items[0].id}.html`}
                key={section.title}>
                {section.title}
              </FooterLink>
            ))}
          </FooterNav>
          <FooterNav layoutHasSidebar={layoutHasSidebar}>
<<<<<<< HEAD
            <MetaTitle onDark={true}>其他</MetaTitle>
            <FooterLink to="/tutorial/tutorial.html">教程</FooterLink>
            <FooterLink to="/blog/">博客</FooterLink>
            <FooterLink to="/acknowledgements.html">
              致谢
            </FooterLink>
            <ExternalFooterLink
              href="https://facebook.github.io/react-native/"
              target="_blank"
              rel="noopener">
              React Native
            </ExternalFooterLink>
=======
            <MetaTitle onDark={true}>{navFooter.more.title}</MetaTitle>
            <SectionLinks links={navFooter.more.items} />
>>>>>>> 941f54180ef5e652221f54ef6d1f6f2e9e063597
          </FooterNav>
        </div>
        <section
          css={{
            paddingTop: 40,
            display: 'block !important', // Override 'Installation' <style> specifics

            [media.greaterThan('xlarge')]: {
              width: 'calc(100% / 3)',
              order: -1,
            },
            [media.greaterThan('large')]: {
              order: -1,
              width: layoutHasSidebar ? null : 'calc(100% / 3)',
            },
            [media.lessThan('large')]: {
              textAlign: 'center',
              width: '100%',
              paddingTop: 40,
            },
          }}>
          <a
            href="https://code.facebook.com/projects/"
            target="_blank"
            rel="noopener">
            <img
              alt="Facebook Open Source"
              css={{
                maxWidth: 160,
                height: 'auto',
              }}
              src={ossLogoPng}
            />
          </a>
          <p
            css={{
              color: colors.subtleOnDark,
              paddingTop: 15,
            }}>
            {`Copyright © ${new Date().getFullYear()} Facebook Inc.`}
          </p>
          <p
            css={{
              color: colors.subtleOnDark,
              paddingTop: 15,
            }}>
            <a href="https://docschina.org/" target="_blank">印记中文</a>
          </p>
          <img css={{
            maxWidth: 200,
            height: 'auto',
            paddingTop: 15
          }} src="https://static.docschina.org/docschina-qr1.jpeg" />
        </section>
      </div>
    </Container>
  </footer>
);

export default Footer;
