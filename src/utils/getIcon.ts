export const getIcon = (name: string) => {
  const color = "#" + Math.floor(Math.random() * 16777215).toString(16)

  if (color === "#ffffff") {
    getIcon(name)
  }

  const firstLetter = name.slice(0, 1)
  return { name: firstLetter, color: color }
}
