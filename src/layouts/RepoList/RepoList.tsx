import GitHubStore from '@gitHubStore';
import {RepoItem} from '@store/GitHubStore/types';
import React, {useState, useEffect, useRef, ReactElement} from 'react';
import './star.svg';
import './styles.css';
import './search.svg'

const gitHubStore = new GitHubStore();
const EXAMPLE_ORGANIZATION: string = 'ktsstudio';

const RepoList: React.FC = (): ReactElement => {
    const [repos, setRepos] = useState<RepoItem[]>([]);
    const [filter, setFilter] = useState('');

    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(()=>{
        if(inputRef.current) {inputRef.current.focus()}
    }, [])

    const loadRepos = () => {
        gitHubStore
            .getOrganizationReposList({
                organizationName: EXAMPLE_ORGANIZATION,
            })
            .then((result) => {
                setRepos(result.data);
            });
    }
    const filterRepos: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const filter = e.target.value;
        setFilter(filter);
    }
    const searchRepo = (repos: any, filter: string): [] => {
        if (filter.length === 0) {
            return repos
        }
        return repos.filter((item: RepoItem) => {
            return item.name.toLowerCase().indexOf(filter.toLowerCase()) > -1
        })
    }

    let visibleRepos = searchRepo(repos, filter);
    const elements = visibleRepos.map((item: RepoItem) => {
        const {id, name, owner, stargazers_count, updated_at} = item;
        const date = new Date(updated_at).toUTCString().split(' ').slice(1, 3).join(' ')
        const logo = owner.avatar_url ? (
            <img src={owner.avatar_url} alt="logo" className="img_logo"/>) : owner.login[0]
        return (
            <div className='repo-item' key={id}>
                <div className='repo-item__logo'>{logo}</div>
                <div className='repo-tem__title'>
                    <p className='repo-item__name'>{name}</p>
                    <a
                        href={owner.html_url}
                        className='repo-item__org_name'
                    >
                        {owner.login}
                    </a>
                    <div className='repo-item__bottom'>
                        <img
                            src={require('./star.svg').default}
                            alt='star'
                            className='repo-item__star'
                        />
                        <div className='repo-item__like'>{stargazers_count}</div>
                        <div className='repo-item__update'> Updated {date}
                        </div>
                    </div>
                </div>
            </div>
        );
    });
    return (
        <div className="container">
            <button onClick={loadRepos}>Загрузить список репозиториев</button>
            <div className="search-form">
                <label>
                    <input type="text" className="search-form__input" placeholder="Введите название организации"
                           value={filter} onChange={filterRepos} ref={inputRef}/>
                </label>
                <button className="search-form__button"><img src={require('./search.svg').default} alt="search"/>
                </button>
            </div>
            {elements}
        </div>
    );
};

export default RepoList;
