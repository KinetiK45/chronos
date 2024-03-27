import './ViewTitle.css'
function ViewTitle({
                       titleStr,
                       onNext = () => {},
                       onPrev = () => {}
}) {

    return <div
        className={'calendar-view-nav-header'}>
        <img
            style={{
                transform: 'rotate(180deg)',
            }}
            onClick={onPrev}
            className={'svg-image'}
            alt={'next'}
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAACE0lEQVR4nO3ZTYhNYRgH8HcQM4nIV1goVlJINmrKZhayMysfKwtKkRVFwo4kSfKxUaQ0EyXyvSGmrKRkMUpSREmUj5jw09uchaYzt2vm3Omec99fnbq72/O/574fzxNCkiRJkiRJkiRJkiRjBeOwHjfwFh/Qh0NYibZQVZiO+2p7jSNYHKoEbXUUP1R8MzZjUig7bDBy73EAs0NZ4ZbR+47jmBvKBOPxpYAA/g3iGGaGMsASjRFDPYj2sS5oSrZlrcPObAs7ifPozZ4enMVhXNRYL7G2UcW2oxN7cA2vNK9LmFNE0bOwBVfxTbl8RPdI9+nu7FceUH6n0VHkCa2MnmB+PQH0qK43WF6r+AX4o9o+YelwAezSGvpz1wRc1jq25QXwSOu4mxfAU62jPy+Am1rHw7wATmkde/MC6NYaYlNlWl4Ak7P7dZXF+0xn7jkgyq6tVRUvR6tCHff7PtXzou7uMiZgE+7hl/K7gql1FT8U5mEHbuOHcvmK7YUNWAwukl1ZWzoG8k7zeoBFhRReC2ZkbbKN2I2j2ULaO+SJPcITuNPgwuN4bWscu4VmhNUNKvw3LsQWXmhm6Ci4zRb7F9exLJQFHhdY+IpQNgZX5pH6iXNxwBLKCpPw/D8LjzOI/XFbDlWAhVlrqpbP2SSpq2lX9dHIjt378Cz7Tw9kn89gDSaO6guSJEmSJEmSJEmSJAznL6eSN7WPDSPWAAAAAElFTkSuQmCC"
        />
        <h3>{`${titleStr}`}</h3>
        <img
            onClick={onNext}
            className={'svg-image'}
            alt={'next'}
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAACE0lEQVR4nO3ZTYhNYRgH8HcQM4nIV1goVlJINmrKZhayMysfKwtKkRVFwo4kSfKxUaQ0EyXyvSGmrKRkMUpSREmUj5jw09uchaYzt2vm3Omec99fnbq72/O/574fzxNCkiRJkiRJkiRJkiRjBeOwHjfwFh/Qh0NYibZQVZiO+2p7jSNYHKoEbXUUP1R8MzZjUig7bDBy73EAs0NZ4ZbR+47jmBvKBOPxpYAA/g3iGGaGMsASjRFDPYj2sS5oSrZlrcPObAs7ifPozZ4enMVhXNRYL7G2UcW2oxN7cA2vNK9LmFNE0bOwBVfxTbl8RPdI9+nu7FceUH6n0VHkCa2MnmB+PQH0qK43WF6r+AX4o9o+YelwAezSGvpz1wRc1jq25QXwSOu4mxfAU62jPy+Am1rHw7wATmkde/MC6NYaYlNlWl4Ak7P7dZXF+0xn7jkgyq6tVRUvR6tCHff7PtXzou7uMiZgE+7hl/K7gql1FT8U5mEHbuOHcvmK7YUNWAwukl1ZWzoG8k7zeoBFhRReC2ZkbbKN2I2j2ULaO+SJPcITuNPgwuN4bWscu4VmhNUNKvw3LsQWXmhm6Ci4zRb7F9exLJQFHhdY+IpQNgZX5pH6iXNxwBLKCpPw/D8LjzOI/XFbDlWAhVlrqpbP2SSpq2lX9dHIjt378Cz7Tw9kn89gDSaO6guSJEmSJEmSJEmSJAznL6eSN7WPDSPWAAAAAElFTkSuQmCC"
        />
    </div>
}

export default ViewTitle;
