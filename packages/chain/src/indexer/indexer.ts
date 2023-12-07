import simpleGit from "simple-git"

export function createIndexer() {
  const git = simpleGit()

  const repoUrl = "https://github.com/ethereum-lists/chains"
  const localPath = "../chain" // Directory where the repo will be cloned

  git.clone(repoUrl, localPath)
    // eslint-disable-next-line no-console
    .then(() => console.log("Repository cloned successfully into:", localPath))
    .catch(err => console.error("Failed to clone repository:", err))
}

// const repoUrl = "https://github.com/ethereum-lists/chains"
// const localPath = "../chain" // Directory where the repo will be cloned

// git.clone(repoUrl, localPath)

// .then(() => console.log("Repository cloned successfully into:", localPath))
// .catch(err => console.error("Failed to clone repository:", err))

// const REPOSITORY_URL = "https://github.com/ethereum-lists/chains"
// const CHAINS_PATH = ""

// git.clone(REPOSITORY_URL, CHAINS_PATH, {}, (error, result) => {
//   if (error) {
//     console.error("Failed to clone repository:", error)
//     return
//   }

//   const folderPath = join(CHAINS_PATH, "path_to_specific_folder")

//   readdir(folderPath, (error, files) => {
//     if (error) {
//       console.error("Failed to read folder:", error)
//       return
//     }

//     files.forEach((file) => {
//       const filePath = join(folderPath, file)

//       if (extname(file) === ".json") {
//         readFile(filePath, "utf8", (error, data) => {
//           if (error) {
//             console.error(`Failed to read file ${file}:`, error)
//             return
//           }

//           const jsonData = JSON.parse(data)
//           console.log("readFile => jsonData =>", jsonData)
//         })
//       }
//     })
//   })
// })
