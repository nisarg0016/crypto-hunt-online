import React, { useEffect } from 'react';
import Terminal from '../terminal';

const LevelTwo = ({flag}) => {
    //let flag = "example flag level 2"
    const fileContents = [
        "A local community came together to plant over 500 trees in the park as part of an effort to improve the environment and create a green space for future generations.",
        "A young boy helped rescue a puppy trapped in a storm drain, becoming a local hero and demonstrating kindness and bravery.",
        "Scientists discovered a way to reduce plastic waste by creating biodegradable materials from plants, paving the way for a cleaner planet.",
        "A small town bakery donated hundreds of loaves of bread to the homeless shelter, feeding those in need during the holiday season.",
        "A 92-year-old grandmother just completed her first marathon, showing that age is just a number when it comes to achieving your dreams.",
        "A group of students designed a solar-powered water filter that provides clean drinking water to remote villages, improving health and sanitation.",
        "A kitten stuck in a tree was safely rescued by a firefighter, much to the relief of the neighborhood children who had grown attached to it.",
        "A local artist created a mural celebrating diversity and unity, bringing a vibrant sense of community pride to the neighborhood.",
        "The city council approved a new plan to convert abandoned lots into community gardens, providing fresh produce and green spaces for residents.",
        "A long-lost letter from a soldier in World War II was finally delivered to his family, offering a touching glimpse into his thoughts during the war.",
        "Volunteers teamed up to clean up a heavily littered beach, removing thousands of pounds of trash and helping restore the natural beauty of the shoreline.",
        "A school in a rural area received a grant for new technology, enabling students to access online resources and improve their education.",
        "A young entrepreneur launched a zero-waste store, promoting sustainable shopping habits and reducing the need for single-use plastics.",
        "A woman reunited with her childhood pet after 10 years thanks to a social media post, demonstrating the power of online communities.",
        "A record number of endangered sea turtles hatched on a protected beach, thanks to conservation efforts by wildlife volunteers.",
        "A local library opened its doors 24/7 to provide a safe study space for students during finals week, along with free coffee and snacks.",
        "A once-endangered species of bird made a comeback in a protected wildlife reserve, a testament to the power of conservation efforts.",
        "A retired teacher started a free tutoring service to help kids in underserved areas succeed in their studies and build confidence.",
        "A group of friends organized a free pop-up concert in the park, spreading joy and music to people who happened to pass by.",
        "A farmer donated surplus crops to local food banks, ensuring that fresh produce reached families in need during tough economic times.",
        "A new initiative was launched to install solar panels on rooftops, drastically reducing the city's carbon footprint.",
        "A young artist’s painting was featured in a major gallery, marking the beginning of a promising career in the art world.",
        "A former refugee opened a successful restaurant, sharing their culture’s cuisine while supporting other refugees with job opportunities.",
        "A city transformed an old parking lot into a beautiful green space, creating a park for families to gather and relax.",
        "A local musician performed free outdoor concerts for the elderly, bringing joy and entertainment to people in nursing homes."
    ];

    const fileSystem = {};
    const fileSizes = {};
    let mapping = []; // filename to size mapping

    const generateFileSystem = () => {
        for (let i = 1; i <= 25; i++) {
            const fileName = `file_${i}.txt`;
            const fileSize = Math.floor(Math.random() * 1000) + 100; // Random size between 100 and 1000 characters
            const content = fileContents[i - 1];
            fileSystem[fileName] = content;
            fileSizes[fileName] = fileSize;
            mapping.push({fileSize, fileName});
        }

        mapping.sort((a, b) => a.fileSize - b.fileSize);
        fileSystem[mapping[0].fileName] = `#FLAG{${flag}}$`;
    }

    useEffect(() => {
        generateFileSystem();
    }, []);

    const getCurrentDirectory = (directories) => {
        let currentDir = fileSystem;
        for (let i = 1; i < directories.length; i++) {
            currentDir = currentDir[directories[i]];
            if (!currentDir) {
              return null;
            }
        }
    
        return currentDir;
    }

    const handleSuccess = () => {
        //alert('Congratulations! You got the flag.');
        // Logic to proceed to the next level
    };
    
    const handleFailure = () => {
        console.log('Incorrect command');
    };
    
    const commandsConfig = {
        help: (params, directories) => 'Level 2: Welcome to CryptoHunt.',
        cat: (filename, directories) => {      
          let currentDir = getCurrentDirectory(directories);
          return (currentDir[filename] === undefined) ? 'No such file exists' : currentDir[filename];
        }
    };


    return (
        <Terminal
          commandsConfig={commandsConfig}
          levelName="Level 1"
          onSuccess={handleSuccess}
          onFailure={handleFailure}
          fileSystem = {fileSystem}
          sortedFiles = {mapping}
        />
      );
}

export default LevelTwo;