function datePeriodStr(targetDate, currentViewDate) {
    let time = targetDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' });
    if (targetDate.getDate() === currentViewDate.getDate())
        return time;
    return `${targetDate.toLocaleDateString(undefined, {day: 'numeric', month: 'long'})} ${time}`;
}

function WeekViewEventDataDisplay({eventData, currentViewDate, onEditButtonPressed}) {
    const categories = {
        'task': 'Завдання',
        'reminder': 'Нагадування',
        'arrangement': 'Захід',
    }

    return <div
        style={{
            padding: '3px',
            fontSize: '14px',
        }}
    >
        {/*<div style={{*/}
        {/*    whiteSpace: 'pre-wrap',*/}
        {/*    overflowWrap: 'break-word',*/}
        {/*    wordWrap: 'break-word',*/}
        {/*}}>{JSON.stringify(eventData)}</div>*/}
        <div
            style={{
                fontSize: '14px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                textOverflow: 'ellipsis',
            }}
            title={`${eventData.title}`}
        >{`${eventData.title}`}</div>
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
            <img
                alt={'place'}
                className={'svg-image'}
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD7UlEQVR4nO2bW4hOURSAN+M2GLdmSkJKLpnGUAzypFxKDUV5ME/kmlEyecKLIiENRkIjnlweZh6IFymS25OZSG5RLg0GMRiX4dNulhrH+f//7H2uv85Xp6Yz+6y91jrnrL32WudXKiUlJSUCgJ7AHKAOuAm8Br7Lof++BRwFlgID1P8CUAzsBd7jnS/AMWCcyleAHsBm4AP2/BDn9VV5eNcvERx38+ZpAMYCTwieN8AUlWSAEuAR4dEKjFdJBOgDXCd87gH9VdIAthIddSpJACOATxE6oAMoU0kBOE70nFIJCnxfDRTXY/cBFUA/OaYBB4BvBnJ0BlmSBAesMFD6GTAxi6xJwHMDeaujtdYF4IxHZduzGd9F3mSDJ+G0ihvgsUdlaw1k6g2TF+6Ha10OgO6Sr3thqoHcGQZxoJuKC2AQ3ulnIHeAgdz4kiKgbwIcEN9OESgwUDSMV6AtXAs9YLDf3xdCEHyk4ga4ZpAAlQe8DF6MxsosAIcxS4TKcxhvkghtUXEDLMMM/STsB6brCC7HDHnsTVJhzcyklL9+ED3vdKVZJQHgYgwO2KOSAlAVsfG/gDFxGTsKmOVSAve6JwiCc475ewPzgZFhGr4AeNlFib+iud6aRmS8jjeljrlXdvm/1nFB0MaXAZ8dipxwaX3djsABB12y0YeOMZ8DK5nRaVhzhrrcBMfYqXI+LPTdLXbMuSrD2OZAVglgUxaFzrqM3x2S8T+B2Y65BkpjNROb/BpfCLzKodhil4AYxrK4w0W/Qzmu0boX+nHAWsvHckjAHaJG/a475pgny2Eu1vpxwAOPCl7Q1SHHtaOBp/jnqvMuAkOBFx6vf2Br/HhDRbe5yBjpEqFN0K22wS5B+YqhHPN+IlBtofByFznDLHuG551VJF3/A+otZFXbOKDRMklZ4iKrlzRDvPBLxv6zhAE7saPRxgHNlpNpJ1RlkLk4x6qi298LM1y7HXuabRzQ4mNCfRc3Zyl4bgBuAG/FaF1V2ggUuYwvkLaZH1ps6v0d+Oekny++JNHRscAvHc5VKioHIKtAhYXxFT5XEHsHBPAKuClQ60yYsjRbdknXJyjMXgEN0ETwtMm3BIukrlAoxyg5p5e4jyHM26RMARr4f2iIKhFKKuuiSIWTjN1HlsB98h/7bwiANeQ/9p/R0Flt7VoIzTf8FUQ0QA35S43yC5377zBygrBpCqx1BpS6lMWTTLuXVrzfxkhS0TpWmllnADAcmCuxoV5+/6O3tVHTKnPXiy5ap+EqLoAi6SBVAuulgHFEUurLwB3pH7ZKa1vvC/7QJudaZcwduaZBZGwXmZUyxz91g5SUlJSUFGXMb7H4HWs4Ys25AAAAAElFTkSuQmCC"
            />
        }
    </div>

}

export default WeekViewEventDataDisplay;
