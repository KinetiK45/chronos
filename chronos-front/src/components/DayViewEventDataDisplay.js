import {useState} from "react";

function datePeriodStr(targetDate, currentViewDate) {
    let time = targetDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' });
    if (targetDate.getDate() === currentViewDate.getDate())
        return time;
    return `${targetDate.toLocaleDateString(undefined, {day: 'numeric', month: 'long'})} ${time}`;
}

function DayViewEventDataDisplay({
                                     eventData,
                                     currentViewDate,
                                     onEditButtonClicked,
                                     canChange
}) {
    const categories = {
        'task': 'Завдання',
        'reminder': 'Нагадування',
        'arrangement': 'Захід',
    }

    const [mouseOnData, setMouseOnData] = useState(false);

    return <div
        style={{
            padding: '5px',
        }}
        onMouseEnter={(event) => setMouseOnData(true)}
        onMouseLeave={(event) => setMouseOnData(false)}
    >
        {/*<div style={{*/}
        {/*    whiteSpace: 'pre-wrap',*/}
        {/*    overflowWrap: 'break-word',*/}
        {/*    wordWrap: 'break-word',*/}
        {/*}}>{JSON.stringify(eventData)}</div>*/}
        <div
            style={{
                fontSize: '18px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                textOverflow: 'ellipsis',
                paddingRight: (canChange && mouseOnData) ? '20px' : '',
            }}
            title={`${eventData.title}`}
        >{`${eventData.title}`}</div>
        {canChange && mouseOnData &&
            <svg
                style={{
                    position: "absolute",
                    right: 5,
                    top: 5
                }}
                onClick={onEditButtonClicked}
                xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 32 32">
                <path d="M 20.96875 3.9160156 C 19.778811 3.9206328 18.52575 4.2457344 17.296875 5.0058594 C 16.964283 5.211704 16.635788 5.4265814 16.310547 5.6445312 C 16.310093 5.6448354 16.309048 5.6442271 16.308594 5.6445312 A 0.287 0.287 0 0 0 16.335938 6.1816406 C 16.341365 6.1853565 16.343925 6.1941909 16.349609 6.1972656 C 20.381609 8.3782656 23.658219 11.669891 25.824219 15.712891 A 0.287 0.287 0 0 0 26.085938 15.880859 A 0.287 0.287 0 0 0 26.349609 15.699219 A 0.287 0.287 0 0 0 26.351562 15.697266 C 26.57166 15.37011 26.787062 15.039663 26.994141 14.705078 C 29.021141 11.426078 27.947375 7.978625 25.984375 6.015625 C 24.758125 4.78875 22.951982 3.9083203 20.96875 3.9160156 z M 14.058594 7.4492188 C 13.871844 7.4707187 13.690063 7.5430625 13.539062 7.6640625 C 12.562062 8.4470625 11.623469 9.2772969 10.730469 10.154297 C 6.3334687 14.476297 3.8931094 20.542734 4.0371094 26.802734 C 4.0561094 27.437734 4.5661719 27.947891 5.2011719 27.962891 C 5.3771719 27.966891 5.5506094 27.96875 5.7246094 27.96875 C 11.793609 27.96875 17.643703 25.542578 21.845703 21.267578 C 22.719703 20.377578 23.548125 19.44175 24.328125 18.46875 C 24.571125 18.16875 24.620172 17.745437 24.451172 17.398438 C 22.355172 13.092437 18.912328 9.6459687 14.611328 7.5429688 C 14.437328 7.4579688 14.245344 7.4277188 14.058594 7.4492188 z M 7.78125 18.792969 C 7.8554844 18.779438 7.9327656 18.779422 8.0097656 18.794922 C 10.617766 19.323922 12.676078 21.382234 13.205078 23.990234 C 13.268078 24.297234 13.078203 24.609797 12.783203 24.716797 C 10.854203 25.413797 8.8202344 25.838359 6.7402344 25.943359 C 6.3602344 25.962359 6.0376406 25.639766 6.0566406 25.259766 C 6.1606406 23.179766 6.5862031 21.144797 7.2832031 19.216797 C 7.3634531 18.994797 7.5585469 18.833563 7.78125 18.792969 z"></path>
            </svg>
        }
        <div>{`${
            datePeriodStr(eventData.startAt, currentViewDate)
        }—${
            datePeriodStr(eventData.endAt, currentViewDate)
        }`}</div>
        <div style={{
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            wordWrap: 'break-word',
        }}>{`${eventData.description}`}</div>
        {eventData.category &&
            <>
                <hr/>
                <div>{`${categories[eventData.category]}`}</div>
            </>
        }
        {(eventData.category === 'reminder'
                || ('notification' in eventData && eventData.notification === true)) &&
            <img
                alt={'notification'}
                className={'svg-image'}
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAADiUlEQVR4nO2by0tVURSHD2oZ1UAnaUVRUZbYA7GUICoIeqjZOFMJeg0aRK+JRDlJiqSBEUSDCKIMels0aJRY/QFhTUrIB6YEUWmFmn2xcAu22Zr33rPP2fd2PrgDPWvvtdbvnLsfZ6/reREREREJANQAH4AeoCyGdmVAN9AF7IixXY/yWe2FBTANuMrfdMTQXhIfozOGdp2azytAhhckwAygWQtkUgGUYNuARuCFoW2rurZVbKco3BiPJCZrCY8HSAceGIIYAEonEOuketyniiR5Asic4Cvw3dDmHpDm2Qa4aHD+Digw2G4C3seQuKnfjYZ+Cybot8F28hXAb83payDHYCt3/ReJMwwcM/SfC7RpthJbua3ks4E+zWEHMM9gew7/OWvwM98wKPYCWTYEuKw5GgTWTXDnbWF6EoqBIc2u0e/kFxmc1BnsSoERiwJI39sNfk8bbs5Cm3f/IzBbs8lRj59txPcczXemYVC85Ffys4CvWueHDHY3CY4bBv97NZsvwEw/BKjSOu7WV15qutNnB5uIrw1aDBlqiTyeSj8EaNI6rTfYmFZ2tmkxxHFes7nlhwC9Wqcl2vUthMdmLZb12vVePwToGtehPGLp2vXHhMdDwzJdBsmYN2dT2bZ269tdNT36sdqLF/G9QIupPJ5tdlwAZwifU15YAG/Czl72ImEln487rAhDgOO4w9EwBHiGOzwNOvnpwE/cYWCy12g2BCjBPYqCFOAI7nE4SAGu4x7XghTgFe7RGqQAn3CPvqCSz8ZdsoIQoBh3WRuEAHtwl8ogBKjDXeqCEOAJ7tIcxADYj7t8szoQYufIy2/qbR6MjuA+8ppsp9/JVxuOxlxGYq3yK/ldAR96+IXEXJEq7/3ipc0PAQZIXvr9EOA+ycsdPwSYC7STfMhxeW7CAghyHg/cJnkGvya9hsAXGD0Gb3F0VpCYnpuqymwIkaeOol34arSrFWqe9cRNAIuBA3IWD7xVZW22GFY+pBplv/j2XIPRep1C9d6gVpW/ShXnS1X4KHfss/qMMfZ3u7IR27uqba3qq9BUORoREeE2wDJVR1QErAKWqDpfebmSpj7Z6n9ybbWylTZLvWQGWJPgrDBkqkJPGoDlCb5HGEyFp2B3nCtHaVPjpQLAwRjrCX4A+7xUgtFfecgC51/Ib4fyvVSF0ZmgQW2q3quPbGIuACvDji8iIsL7r/gD13xEQMJYEr0AAAAASUVORK5CYII="
            />
        }
        {eventData.category === 'task' &&
            'complete' in eventData &&
            (eventData.complete === 1 || eventData.complete === true) &&
            <img
                alt={'complete'}
                className={'svg-image'}
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAADfUlEQVR4nO3aSYgdRRzH8U6YGDUaBwNiFHcT4yhIGDciRBJUDIzbyXg14sE9LhgCiuBB1IgKIg4uRKM34w5q3BLQi4IXV9xOHlTEJUaNOvEjxdTh0fTLW7umRvoLDY/u6vr//7/qrn71r39RNDQ0NDQ0NKQAczGG1ViLq+OxNp4L1+YW/ydwCG7FK/hZZ36JbTeEe4vZDrbony3FbAfvDCDA28UserfPxe1YWLr23AACPF/q6wBsxHnZzBW4CF+0OH1V6fr5+KrHwPfgQ6wq9XVNS5tg88LkAbeC6/Fvyfmn27Q9HJfhATyL7fgoHm/hGWzCxTi4TR8vlWwF29cVMwHOwD8Vo/cT9q3B3v74tcJe8OH0YdvrSId3exL7FEMCo/GpacfWYdnqijDC2G3v/ICHsBLz+rCxABPhlcJvHWztruOpa0sMqhd24Q3cjStwDsaxBMvi7zVhAsX9eA9/92hjZZEK3CY/NqYUYJv8eDVV8HOwU36ENcScFAIcI1+OTCHAhHxZk0KADfLllhQCPCVfNqcQYId8qX/5jC/ly+cpBNiVOKiw2Pm2y7Y76w5+VFpexGEtX5+pLu45sE4BjpWG8EdrXZ/zz1F1CjCWIPgwx5zQxn5InnRiWZ0CjNccfBjhRRV25+HBLvtYXqcAZ9UY/AtVSZS4XP6gh35W1CnAqh6D+iYmMm/G93tp93Kb4Nfh9x5tnl2nACt6cCQkLMda7j0Ur1W0ex3zK1acd+qPM+sUYHkPjvxZXp7GwO5pafMZDiq1GcHj+ueUOgU4sUdnLm/Tz30xe7y0QqAnDcbSOgU4uo8NjnvLj3jsa0nFubsMzhF1CrBggM/baIe+W3d9BmG/2gQIxNRTP7wfBCwqwKn4awjB/1jUDT4dwMGtFRPjQnxtOHycQoA3B3Ty2lJ/YU9wWGxLIcCjAzo5FbfRw+bIZsNlMoUA6+VL/TvFpgshcmV1CgEWy5c0RVWmd35z47skwQfi0jU30tUI4Cb5cUNKAU6TH+MpBRjJbIc4+DKSTIAAnpAPjxWpwfFd1O6kIPhwXHIBArgAf8xg8MH2RDGT4OSY1AzJj1RMxaLJk4pcwCJciXcrqkeHxSex9H5xkTOm/y6HsthHYuJzT5+jHAJ+GJeGrHIxW8H88LjiEtyIO2Jd8GQ8NsVz62Ot8FhVHrGhoaGhoaEYKv8BOrjCqxz9r68AAAAASUVORK5CYII="
            />
        }
        {eventData.category === 'arrangement' &&
            'place' in eventData &&
            eventData.place &&
            eventData.place.trim() !== '' &&
            <div
                style={{
                    display: 'flex',
                    alignItems: "center",
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                    wordWrap: 'break-word',
                }}
            >
                <img
                    alt={'place'}
                    className={'svg-image'}
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD7UlEQVR4nO2bW4hOURSAN+M2GLdmSkJKLpnGUAzypFxKDUV5ME/kmlEyecKLIiENRkIjnlweZh6IFymS25OZSG5RLg0GMRiX4dNulhrH+f//7H2uv85Xp6Yz+6y91jrnrL32WudXKiUlJSUCgJ7AHKAOuAm8Br7Lof++BRwFlgID1P8CUAzsBd7jnS/AMWCcyleAHsBm4AP2/BDn9VV5eNcvERx38+ZpAMYCTwieN8AUlWSAEuAR4dEKjFdJBOgDXCd87gH9VdIAthIddSpJACOATxE6oAMoU0kBOE70nFIJCnxfDRTXY/cBFUA/OaYBB4BvBnJ0BlmSBAesMFD6GTAxi6xJwHMDeaujtdYF4IxHZduzGd9F3mSDJ+G0ihvgsUdlaw1k6g2TF+6Ha10OgO6Sr3thqoHcGQZxoJuKC2AQ3ulnIHeAgdz4kiKgbwIcEN9OESgwUDSMV6AtXAs9YLDf3xdCEHyk4ga4ZpAAlQe8DF6MxsosAIcxS4TKcxhvkghtUXEDLMMM/STsB6brCC7HDHnsTVJhzcyklL9+ED3vdKVZJQHgYgwO2KOSAlAVsfG/gDFxGTsKmOVSAve6JwiCc475ewPzgZFhGr4AeNlFib+iud6aRmS8jjeljrlXdvm/1nFB0MaXAZ8dipxwaX3djsABB12y0YeOMZ8DK5nRaVhzhrrcBMfYqXI+LPTdLXbMuSrD2OZAVglgUxaFzrqM3x2S8T+B2Y65BkpjNROb/BpfCLzKodhil4AYxrK4w0W/Qzmu0boX+nHAWsvHckjAHaJG/a475pgny2Eu1vpxwAOPCl7Q1SHHtaOBp/jnqvMuAkOBFx6vf2Br/HhDRbe5yBjpEqFN0K22wS5B+YqhHPN+IlBtofByFznDLHuG551VJF3/A+otZFXbOKDRMklZ4iKrlzRDvPBLxv6zhAE7saPRxgHNlpNpJ1RlkLk4x6qi298LM1y7HXuabRzQ4mNCfRc3Zyl4bgBuAG/FaF1V2ggUuYwvkLaZH1ps6v0d+Oekny++JNHRscAvHc5VKioHIKtAhYXxFT5XEHsHBPAKuClQ60yYsjRbdknXJyjMXgEN0ETwtMm3BIukrlAoxyg5p5e4jyHM26RMARr4f2iIKhFKKuuiSIWTjN1HlsB98h/7bwiANeQ/9p/R0Flt7VoIzTf8FUQ0QA35S43yC5377zBygrBpCqx1BpS6lMWTTLuXVrzfxkhS0TpWmllnADAcmCuxoV5+/6O3tVHTKnPXiy5ap+EqLoAi6SBVAuulgHFEUurLwB3pH7ZKa1vvC/7QJudaZcwduaZBZGwXmZUyxz91g5SUlJSUFGXMb7H4HWs4Ys25AAAAAElFTkSuQmCC"
                />
                {`${eventData.place}`}
            </div>
        }
    </div>

}

export default DayViewEventDataDisplay;
