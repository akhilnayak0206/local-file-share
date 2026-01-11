# 🛡️ AirLock Transfer

**AirLock** is a security-first, zero-configuration utility for transferring files from any mobile device to a PC over a local network. It creates an ephemeral "bridge" between devices using an isolated Python environment, ensuring your host system remains untouched and clean.

## 🌟 Why AirLock?

Standard file sharing (like Samba or SMB) often requires complex permissions and leaves ports open permanently. AirLock is different:
- **Zero Global Footprint**: All dependencies are contained in a local "AirLock" bubble. No global Python packages are installed.
- **Atomic Cleanup**: Upon stopping the server, the network port is immediately killed and firewall rules are revoked.
- **Cargo Isolation**: Files are initially quarantined in a hidden directory and only moved to the `airlock_cargo` folder once the connection is safely closed.



## 🛠️ Prerequisites

- **Node.js** (v14 or higher)
- **Python 3** & **Venv**
  ```bash
  sudo apt update
  sudo apt install python3 python3-venv

```

## 🚀 Quick Start

1. **Clone the repository:**
```bash
cd airlock-transfer
```


2. **Launch the AirLock:**
```bash
npm start

```


3. **Transfer Cargo:**
* On your iPhone/Android, navigate to the IP address displayed in your terminal.
* Select your files and tap **Upload**.
* Wait for the "Success" confirmation on your mobile browser.


4. **Cycle the AirLock:**
* Press `Ctrl+C` in your terminal.
* The server shuts down, and your files are moved to the `./airlock_cargo` directory.



## 📁 Repository Structure

* `index.js`: The AirLock controller.
* `package.json`: Project metadata and start scripts.
* `airlock_cargo/`: The final destination for your transferred files.
* `.tmp_airlock_env/`: (Hidden) The isolated Python virtual environment.

## 🛡️ Security Protocol

AirLock manages the Ubuntu Firewall (UFW) dynamically. It opens port `8000` only while the script is active and explicitly denies access the moment you signal a shutdown. This ensures your machine is not left "listening" to the network a second longer than necessary.

## 📄 License

MIT — Go wild.

## 🙏 Acknowledgments

Thanks to Gemini for the initial code and assistance!

ThankYouPeace.