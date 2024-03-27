import Requests from "../API/requests";
import './UserFinder.css';

function UserFinder({
                        exclude_ids = [],
                        onFound
}) {
    return <div
        className={'userFinder'}
    >
        <svg
            style={{
                height: '100%',
                marginRight: '10px'
            }}
            xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 32 32">
            <path d="M28.605 21.884c-.572-1.701-3.203-3.705-5.894-4.816-.241-.099-.511.014-.629.246-.519 1.014-1.192 1.956-2.02 2.785-.838.838-1.791 1.517-2.819 2.038-.233.118-.347.389-.248.63 1.146 2.776 3.239 5.467 4.852 5.874C26.345 29.777 29.893 25.717 28.605 21.884zM12.219 3.165000000000001A9.091 9.091 0 1012.219 21.347 9.091 9.091 0 1012.219 3.165000000000001z"></path>
        </svg>
        <input
            style={{
                height: '100%'
            }}
            type={'text'}
            placeholder={'Імʼя користувача'}
            name={'userFinder'}
            onChange={(event) => {
                if (event.target.value.trim().length > 0)
                    Requests.findUsername(
                        localStorage.getItem('token'),
                        {
                            username_part: event.target.value,
                            user_ids_to_exclude: exclude_ids
                        }
                    )
                        .then((resp) => {
                            if (resp.state === true)
                                onFound(resp.data)
                        })
                else
                    onFound([]);
            }}
        />
    </div>
}

export default UserFinder;
