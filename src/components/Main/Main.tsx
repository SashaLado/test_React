import { ChangeEvent, useEffect, useState } from "react"

import { IFiles, IFolders } from "services/api/types"
import Folders from "services/api/mock/folders"
import { getIcon } from "utils"

import Select from "assets/icons/select.svg"
import { ReactComponent as Cross } from "assets/icons/cross.svg"
import { ReactComponent as FolderIcon } from "assets/icons/folder.svg"
import "./Main.css"

export const Main = () => {
  const [selected, setSelected] = useState<IFiles[]>([])
  const [searchedFiles, setSearchedFiles] = useState<IFiles[]>([])
  const [search, setSearch] = useState<string>("")

  useEffect(() => {
    let allFiles: IFiles[][] = []
    Folders.forEach(folder => allFiles.push(folder.files))
    setSearchedFiles(allFiles.flat())
  }, [])

  const getFolders = (event: ChangeEvent<HTMLInputElement>, folder: IFolders) => {
    const eventTarget = event.target as HTMLInputElement
    if (eventTarget.checked) {
      const newSelected = selected.concat(folder.files)
      setSelected(newSelected)
    } else {
      const newSelected = selected.filter(file => file.folderId !== folder.id)
      setSelected(newSelected)
    }
  }

  const onDelete = (fileId: string) => {
    const newSelected = selected.filter(file => file.id !== fileId)
    setSelected(newSelected)
  }

  const onAdd = (file: IFiles) => {
    if (selected.includes(file)) {
      return alert("Sorry, this item has already been added!")
    } else {
      setSelected([...selected, file])
    }
  }

  const onChangeStatus = (file: IFiles, event: ChangeEvent<HTMLSelectElement>) => {
    const eventTarget = event.target as HTMLSelectElement
    const value = eventTarget.value

    const relevantFolder = Folders.find(item => item.id === file.folderId)

    if (relevantFolder) {
      relevantFolder.files.forEach((fileInFolder, index) => {
        if (file === fileInFolder) {
          Folders[Folders.indexOf(relevantFolder)].files[index].status = value
        }
      })
    }

    const newSelected = selected
    newSelected.map(item => {
      if (item.id === file.id) {
        item.status = value
      }
    })

    setSelected([...newSelected])
  }

  const options = ["Can Edit", "Can View", "Choose"]

  return (
    <div className="container">
      <div className="folders-section section">
        <h2>Selected Folders</h2>
        <ul className="folders__wrapper">
          {Folders.map((item, index) => (
            <li className="folders__item" key={index}>
              <div className="folder__name">
                <FolderIcon className="folder__icon" />
                <div className="folder__title" id={item.id}>
                  {item.name}
                </div>
              </div>
              <div className="folder__checkbox">
                <input
                  checked={selected.some(file => file.folderId === item.id)}
                  onChange={event => getFolders(event, item)}
                  type="checkbox"
                  className="custom-checkbox"
                  id={`checkbox-${item.id}`}
                  name="happy"
                />
                <label htmlFor={`checkbox-${item.id}`} />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="files-section section">
        <h2>Selected Files</h2>
        <ul className="files__wrapper">
          {!!selected.length &&
            selected.map((item, index) => (
              <li className="files__item" key={index}>
                <div className="file__name-block">
                  <div
                    className="file__img"
                    style={
                      item.img === "none"
                        ? { backgroundColor: getIcon(item.name).color }
                        : { backgroundImage: `url("${item.img}")` }
                    }
                  >
                    {item.img === "none" && getIcon(item.name).name}
                  </div>
                  <div className="file__name">{item.name}</div>
                </div>
                <div className="file__job-wrapper">
                  <span className={`file__job text_thing ${item.job}`}>{item.job}</span>
                </div>
                <div className="file__email">{item.email}</div>
                <div className="file__buttons">
                  <select
                    className={`file__select 
                            ${item.status.toLowerCase() === "choose" ? "choose" : ""}`}
                    onChange={event => onChangeStatus(item, event)}
                    style={{ backgroundImage: `url("${Select}")` }}
                  >
                    {options.map((option, index) => (
                      <option selected={option.toLowerCase() === item.status.toLowerCase()}>{option}</option>
                    ))}
                  </select>
                  <button onClick={() => onDelete(item.id)} type="button" className="file__delete-btn">
                    <Cross />
                  </button>
                </div>
              </li>
            ))}
        </ul>
        <div className="search-section">
          <div className="search__wrapper">
            <input type="search" id="search" placeholder="Name" onChange={e => setSearch(e.target.value)} />
          </div>
          <ul className="search__items-wrapper">
            {searchedFiles
              .filter(file => file.name.toLowerCase().match(search.toLowerCase()))
              .map((item, index) => (
                <li key={index} className="search__item">
                  <div className="file__name-block">
                    <div
                      className="file__img"
                      style={
                        item.img === "none"
                          ? { backgroundColor: getIcon(item.name).color }
                          : { backgroundImage: `url("${item.img}")` }
                      }
                    >
                      {item.img === "none" && getIcon(item.name).name}
                    </div>
                    <div className="file__name">{item.name}</div>
                  </div>
                  <div className="file__job-wrapper">
                    <span className={`file__job text_thing ${item.job}`}>{item.job}</span>
                  </div>
                  <div className="file__phone">{item.phone}</div>
                  <div className="file__email">{item.email}</div>
                  <div className="search__buttons">
                    <button onClick={() => onAdd(item)} type="button" className="file__add-btn">
                      Add
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
