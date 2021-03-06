import React, {Fragment, useState} from "react";
import {Button, Container, Icon, Menu, Responsive, Segment, Sidebar, Visibility} from "semantic-ui-react";
import {Link, withRouter} from "react-router-dom";
import {Paths} from "../../App";

type NonHeroProps = {
  children: Node,
  hideStartTraining: boolean,
  match: Object,
  location: Object,
  history: Object,
}

type Props = NonHeroProps & {
  hero: boolean,
}

function DesktopContainer({ children, hideStartTraining, hero, location }: Props) {
  const [fixedMenuVisible, setFixedMenu] = useState(false);

  return (
    <Responsive minWidth={Responsive.onlyTablet.minWidth}>
      <Visibility
        once={false}
        onBottomPassed={() => setFixedMenu(true)}
        onBottomPassedReverse={() => setFixedMenu(false)}
      >
        <Segment
          inverted
          textAlign='center'
          style={hero ? { minHeight: 700, padding: '1em 0em', minHeight: "100vh" } : { padding: '0' }}
          vertical
        >
          <Menu
            fixed={fixedMenuVisible ? 'top' : null}
            inverted={!fixedMenuVisible}
            pointing={!fixedMenuVisible}
            secondary={!fixedMenuVisible}
            size='large'
          >
            <Container>
              <Link to={Paths.HOME}>
                <Menu.Item as='div' active={location.pathname === Paths.HOME}>Home</Menu.Item>
              </Link>

            </Container>
          </Menu>
          {children}
        </Segment>
      </Visibility>
    </Responsive>
  )
}

function MobileNonHeroContainer({ children, hideStartTraining, location }: NonHeroProps) {
  return (
    <Responsive as={Sidebar.Pushable} maxWidth={Responsive.onlyMobile.maxWidth}>
      <Segment
        inverted
        textAlign='center'
        style={{ padding: '0' }}
        vertical
      >
        <Menu
          inverted
          pointing
          secondary
          size='small'
        >
          <Container>
            <Link to={Paths.HOME}>
              <Menu.Item as='div' active={location.pathname === Paths.HOME}>Home</Menu.Item>
            </Link>
          </Container>
        </Menu>
        {children}
      </Segment>
    </Responsive>
  )
}

function MobileHeroContainer({ children, hideStartTraining, location }: NonHeroProps) {
  const [sidebarOpened, setSidebarOpened] = useState(false);

  return (
    <Responsive as={Sidebar.Pushable} maxWidth={Responsive.onlyMobile.maxWidth}>
      <Sidebar
        as={Menu}
        animation='push'
        inverted
        onHide={() => setSidebarOpened(false)}
        vertical
        visible={sidebarOpened}
      >
        <Link to={Paths.HOME}>
          <Menu.Item as='div' active={location.pathname === Paths.HOME}>Home</Menu.Item>
        </Link>


      </Sidebar>

      <Sidebar.Pusher dimmed={sidebarOpened}>
        <Segment
          inverted
          textAlign='center'
          style={{ minHeight: 350, padding: '1em 0em', minHeight: "100vh" }}
          vertical
        >
          <Container>
            <Menu inverted pointing secondary size='large'>
              <Menu.Item onClick={() => setSidebarOpened(true)}>
                <Icon name='sidebar' />
              </Menu.Item>
            </Menu>
          </Container>
          {children}
        </Segment>
      </Sidebar.Pusher>
    </Responsive>
  );
}

function MobileContainer(props: Props) {
  const { hero, children, ...otherProps } = props;
  if (hero) {
    return (<MobileHeroContainer {...otherProps}>{children}</MobileHeroContainer>);
  } else {
    return (<MobileNonHeroContainer {...otherProps}>{children}</MobileNonHeroContainer>)
  }
}


function NavBar(props: Props) {
  const { children, ...noChildrenProps } = props;

  return (
    <div>
      <DesktopContainer {...noChildrenProps}>{children}</DesktopContainer>
      <MobileContainer {...noChildrenProps}>{children}</MobileContainer>
    </div>
  );
}

NavBar.defaultProps = { children: null, hideStartTraining: false, hero: false };

export default withRouter(NavBar);
