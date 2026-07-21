import app from "./app";
import config from "./config";

const PORT = config.port || 5000;

async function main() {
    try {

        console.log("Connected to the database successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {

        console.error("Error", error);

        process.exit(1);
    }
}

main();