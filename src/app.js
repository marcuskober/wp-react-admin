import './app.scss'

const { __ } = wp.i18n

const {
    Notice,
    Spinner,
    Panel,
    PanelBody,
    PanelRow,
    ToggleControl,
    BaseControl,
    TextControl,
    Button,
} = wp.components

const {
    render,
    Component,
    Fragment,
} = wp.element

class App extends Component {
    constructor() {
        super(...arguments)

        this.changeSetting = this.changeSetting.bind(this)

        this.state = {
            settingsLoaded: false,
            isSaving: false,
            dataChanged: false,
            admin_react_example_bool_1: false,
            admin_react_example_text_1: '',
        }
    }

    componentDidMount() {
      window.addEventListener('beforeunload', this.beforeUnload.bind(this))

      wp.api.loadPromise.then(() => {
          this.settings = new wp.api.models.Settings()

          if (this.state.settingsLoaded === false) {
              this.settings.fetch().then(response => {
                  this.setState({
                      settingsLoaded: true,
                      admin_react_example_bool_1: Boolean(response.admin_react_example_bool_1),
                      admin_react_example_text_1: response.admin_react_example_text_1,
                  })
              })
          }
      })
    }

    componentWillUnmount() {
      window.removeEventListener('beforeunload', this.beforeUnload.bind(this))
    }

    changeSetting(setting, value) {
        this.setState({ isSaving: true });

        const model = new wp.api.models.Settings({
            [setting]: value
        })

        model.save().then(response => {
            this.setState({
                [setting]: response[setting],
                isSaving: false,
                dataChanged: false,
            })
        })
    }

    beforeUnload(event) {
      if (! this.state.dataChanged) {
        return
      }

      event.preventDefault()
      event.returnValue = true
    }

    render() {
        if (! this.state.settingsLoaded) {
            return (
                <Notice>
                    Loading data ... <Spinner />
                </Notice>
            )
        }

        return (
            <Fragment>
                <div class="react-admin-page">
                    <Panel header="React admin">
                        <PanelBody title="Example settings">
                            <PanelRow>
                                <ToggleControl
                                    label="Example setting 1"
                                    help="Example boolean setting"
                                    checked={ this.state.admin_react_example_bool_1 }
                                    onChange={ () => this.changeSetting('admin_react_example_bool_1', ! this.state.admin_react_example_bool_1) }
                                >

                                </ToggleControl>
                            </PanelRow>

                            <PanelRow>
                                <BaseControl
                                    id="admin_react_example_text_1"
                                    label="Example text setting 1"
                                    help="Example simple input"
                                >
                                    <TextControl
                                        value={ this.state.admin_react_example_text_1 }
                                        onChange={ value => this.setState({admin_react_example_text_1: value, dataChanged: true})}
                                        disabled={ this.state.isSaving }
                                    />
                                </BaseControl>
                            </PanelRow>

                            <PanelRow>
                                <Button
                                    isPrimary
                                    isLarge
                                    onClick={ () => this.changeSetting('admin_react_example_text_1', this.state.admin_react_example_text_1) }
                                    disabled={ this.state.isSaving || ! this.state.dataChanged }
                                    >Save</Button>
                            </PanelRow>
                        </PanelBody>
                    </Panel>
                </div>
            </Fragment>
        )
    }
}

render(
    <App/>,
    document.getElementById('react-admin-app')
)
