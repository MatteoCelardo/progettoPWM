document.getElementById("signForm").addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById("pw").value = CryptoJS.SHA256(document.getElementById("pw").value).toString(); 
    document.getElementById("signForm").submit();
});