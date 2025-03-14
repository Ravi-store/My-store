document.addEventListener("DOMContentLoaded", loadData);

function addItem() {
    const modelNumber = document.getElementById('modelNumber').value || '-';
    const modelName = document.getElementById('modelName').value || '-';
    const modelPrice = document.getElementById('modelPrice').value ? parseFloat(document.getElementById('modelPrice').value).toFixed(2) : '0.00';
    let date = document.getElementById('date').value;
    
    if (!date) {
        const today = new Date();
        date = today.toISOString().split('T')[0];
    }
    
    let inventoryData = getInventoryData();
    inventoryData.push({ modelNumber, modelName, modelPrice, date });
    saveData(inventoryData);
    displayData(inventoryData);
}

function deleteItem(index) {
    let inventoryData = getInventoryData();
    inventoryData.splice(index, 1);
    saveData(inventoryData);
    displayData(inventoryData);
}

function displayData(data) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    let totalPrice = 0;
    
    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.modelNumber}</td>
            <td>${item.modelName}</td>
            <td>₹${item.modelPrice}</td>
            <td>${item.date}</td>
            <td><button onclick="deleteItem(${index})">Delete</button></td>
        `;
        tableBody.appendChild(row);
        totalPrice += parseFloat(item.modelPrice);
    });
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
}

function getInventoryData() {
    const data = localStorage.getItem('inventoryData');
    return data ? JSON.parse(data) : [];
}

function saveData(data) {
    localStorage.setItem('inventoryData', JSON.stringify(data));
}

function loadData() {
    const inventoryData = getInventoryData();
    displayData(inventoryData);
}

function clearInventory() {
    localStorage.removeItem('inventoryData');
    displayData([]);
}

function downloadPDF() {
    // Get the inventory data
    const inventoryData = getInventoryData();
    
    // Create PDF document
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text("Inventory Management Report", 14, 20);
    
    // Add date
    doc.setFontSize(12);
    const today = new Date();
    doc.text(`Date: ${today.toLocaleDateString()}`, 14, 30);
    
    // Calculate total price
    let totalPrice = 0;
    inventoryData.forEach(item => {
        totalPrice += parseFloat(item.modelPrice);
    });
    
    // Convert data for table
    const tableData = inventoryData.map(item => [
        item.modelNumber,
        item.modelName,
        `₹${item.modelPrice}`,
        item.date
    ]);
    
    // Add table to PDF
    doc.autoTable({
        head: [['Model Number', 'Model Name', 'Price', 'Date']],
        body: tableData,
        startY: 40,
        theme: 'grid',
        styles: { fontSize: 10 }
    });
    
    // Add total price
    const finalY = doc.lastAutoTable.finalY || 40;
    doc.text(`Total Price: ₹${totalPrice.toFixed(2)}`, 150, finalY + 10);
    
    // Save PDF
    doc.save("inventory_report.pdf");
}