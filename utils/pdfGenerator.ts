
import { jsPDF } from "jspdf";
import { PatientRecord, Outcome } from "../types";

export const generateMedicalReport = (record: PatientRecord) => {
  const doc = new jsPDF();
  const lineHeight = 7;
  
  // --- COVER PAGE (USECHH 1) ---
  
  // Top Right
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("USECHH 1", 190, 20, { align: "right" });

  // Center Titles
  doc.setFontSize(14);
  doc.text("MEDICAL SURVEILLANCE PROGRAMME", 105, 40, { align: "center" });
  
  doc.setFontSize(12);
  doc.text("EXAMINATION FORM", 105, 50, { align: "center" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Occupational Safety and Health Act 1994 (Act 514)", 105, 60, { align: "center" });
  doc.text("Use and Standard of exposure of chemicals", 105, 66, { align: "center" });
  doc.text("hazardous to health regulation 2000", 105, 71, { align: "center" });
  
  doc.text("Department of Occupational Safety and Health", 105, 80, { align: "center" });
  doc.text("Ministry of Human Resources", 105, 86, { align: "center" });

  // Fields
  let yPos = 110;
  const leftColX = 50;
  const rightColX = 90;

  doc.setFont("helvetica", "normal");
  doc.text("Workplace:", leftColX, yPos);
  doc.setFont("helvetica", "bold");
  doc.text(record.companyName || "_______________________", rightColX, yPos);
  
  yPos += 15;
  doc.setFont("helvetica", "normal");
  doc.text("Chemical(s):", leftColX, yPos);
  doc.setFont("helvetica", "bold");
  // Try to find chemical name from summary or default
  const chemicalName = record.summaryRecord?.chemicalName || "";
  doc.text(chemicalName || "_______________________", rightColX, yPos);

  // Checkboxes
  yPos += 25;
  doc.setFont("helvetica", "normal");
  doc.text("Types of Medical Examination:", 105, yPos, { align: "center" });
  
  yPos += 15;
  const checkboxX = 75;
  
  // Helper for checkbox line
  const drawCheckbox = (label: string, isChecked: boolean, y: number) => {
      doc.rect(checkboxX, y - 4, 4, 4); // Box
      if (isChecked) {
          doc.setFont("helvetica", "bold");
          doc.text("X", checkboxX + 0.8, y - 0.5); // Checkmark
      }
      doc.setFont("helvetica", "normal");
      doc.text(label, checkboxX + 10, y);
  };

  drawCheckbox("Pre-placement", false, yPos);
  yPos += 10;
  drawCheckbox("Periodic", true, yPos); // Defaulting to Periodic as per typical surveillance
  yPos += 10;
  drawCheckbox("Return To Work", false, yPos);
  yPos += 10;
  drawCheckbox("Exit", false, yPos);

  // Disclaimer Box
  yPos += 25;
  doc.setLineWidth(0.5);
  doc.rect(30, yPos, 150, 25);
  doc.setFontSize(9);
  const disclaimer = "This documents is confidential and must be kept by the employer. It must be produced to the attendaing OHD upon request. Please write clearly.";
  const splitDisclaimer = doc.splitTextToSize(disclaimer, 140);
  doc.text(splitDisclaimer, 105, yPos + 8, { align: "center" });

  // --- START ACTUAL REPORT ON NEW PAGE ---
  doc.addPage();
  yPos = 20;

  const checkPageBreak = (spaceNeeded: number) => {
    if (yPos + spaceNeeded > 280) {
      doc.addPage();
      yPos = 20;
    }
  };

  const addSectionTitle = (title: string) => {
    checkPageBreak(15);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(title.toUpperCase(), 15, yPos);
    doc.setLineWidth(0.5);
    doc.line(15, yPos + 2, 195, yPos + 2);
    yPos += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
  };

  const addField = (label: string, value: string | number | undefined, xOffset: number = 15, inline: boolean = false) => {
    const valStr = value ? String(value) : "N/A";
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, xOffset, yPos);
    doc.setFont("helvetica", "normal");
    
    // Simple text wrapping for long values
    const splitText = doc.splitTextToSize(valStr, 180 - xOffset); // approximate width
    doc.text(splitText, xOffset + 40, yPos);
    
    if (!inline) {
        yPos += (lineHeight * splitText.length);
        checkPageBreak(lineHeight);
    }
  };

  // --- HEADER OF DETAIL PAGE ---
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("MEDICAL SURVEILLANCE REPORT", 105, yPos, { align: "center" });
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 105, yPos, { align: "center" });
  yPos += 15;

  // --- WORKER DETAILS ---
  addSectionTitle("1. Worker Particulars");
  addField("Name", record.patientName);
  addField("Company", record.companyName);
  addField("Visit Date", record.visitDate);
  addField("Age / Gender", `${record.age} / ${record.gender}`);
  yPos += 5;

  // --- VITALS & EXAM SUMMARY ---
  addSectionTitle("2. Examination Summary");
  addField("Temperature", `${record.temperature} °F`);
  addField("Blood Pressure", record.physicalExam?.vitalSigns?.bloodPressure);
  addField("BMI", record.physicalExam?.anthropometry?.bmi);
  addField("Overall Outcome", record.outcome);
  yPos += 5;

  // --- CONCLUSION OF MS FINDINGS (Step 12) ---
  if (record.msConclusion) {
    addSectionTitle("3. Conclusion of MS Findings");
    addField("Chemical Exposure Hx", record.msConclusion.historyChemicalExposure);
    if(record.msConclusion.historyChemicalExposureNotes) addField("Exposure Notes", record.msConclusion.historyChemicalExposureNotes);
    
    addField("Clinical Findings", record.msConclusion.clinicalFindings);
    if(record.msConclusion.clinicalFindingsNotes) addField("Clinical Notes", record.msConclusion.clinicalFindingsNotes);
    
    addField("Target Organ Results", record.msConclusion.targetOrganResults);
    addField("BEI Results", record.msConclusion.beiResults);
    addField("Fitness to Work", record.msConclusion.fitnessToWork);
    yPos += 5;
  }

  // --- RECOMMENDATION (Step 13) ---
  if (record.recommendation) {
    checkPageBreak(60); 
    addSectionTitle("4. Recommendation to Employer");
    
    // Notes box
    doc.setDrawColor(150);
    doc.rect(15, yPos, 180, 30);
    yPos += 5;
    
    const splitNotes = doc.splitTextToSize(record.recommendation.notesToEmployer || "No specific recommendations.", 170);
    doc.text(splitNotes, 20, yPos);
    yPos += 35;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text("The Implication of the above results has been explained by the OHD.", 105, yPos, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    yPos += 10;

    // Doctor Details
    addField("OHD Name", record.recommendation.ohdName);
    addField("MMC No", record.recommendation.mmcNo);
    addField("DOSH Reg No", record.recommendation.doshNo);
    addField("Clinic", record.recommendation.clinicName);
    addField("Date", record.recommendation.date);
    yPos += 5;
  }

  // --- SUMMARY RECORD (Step 14) ---
  if (record.summaryRecord) {
    doc.addPage();
    yPos = 20;
    addSectionTitle("5. Summary Record of Employee");
    
    addField("Worker Name", record.summaryRecord.workerName);
    addField("Chemical Name", record.summaryRecord.chemicalName);
    addField("MS Date", record.summaryRecord.msDate);
    addField("Health Effects", record.summaryRecord.healthEffectsCHTH);
    addField("Target Organ", record.summaryRecord.targetOrgan);
    addField("BEI Determinant", record.summaryRecord.beiDeterminant);
    addField("Work Relatedness", record.summaryRecord.workRelatedness);
    
    doc.setFont("helvetica", "bold");
    addField("CONCLUSION", record.summaryRecord.conclusion);
    
    addField("Date of MRP", record.summaryRecord.mrpDate);
    addField("OHD Signature/Reg", record.summaryRecord.ohdDoshReg);
  }

  // --- CERTIFICATE OF FITNESS (FINAL PAGE) ---
  doc.addPage();
  
  // Header
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Occupational Safety & Health Act 1994", 105, 30, { align: "center" });
  doc.text("(Act 514)", 105, 35, { align: "center" });
  
  doc.text("Occupational Safety and Health (Use and Standard of Exposure of Chemicals", 105, 45, { align: "center" });
  doc.text("Hazardous to Health) Regulations 2000", 105, 50, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICATE OF FITNESS", 105, 65, { align: "center" });

  // Body Content
  let certY = 90;
  const col1X = 25;
  const col2X = 85;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  // Row 1: Name
  doc.text("Name of person examined", col1X, certY);
  doc.setFont("helvetica", "bold");
  doc.text((record.patientName || "").toUpperCase(), col2X, certY);
  
  // Row 2: NRIC/Passport & Demographics
  certY += 15;
  doc.setFont("helvetica", "normal");
  doc.text("NRIC/Passport", col1X, certY);
  doc.setFont("helvetica", "bold");
  doc.text(record.icPassport || "N/A", col2X, certY);
  
  // Inline DOB and Sex
  doc.setFont("helvetica", "normal");
  doc.text("Date of Birth", 130, certY);
  doc.setFont("helvetica", "bold");
  // Simple check for age based birth year approx if no explicit DOB field
  const approxYear = new Date().getFullYear() - record.age;
  doc.text(`${approxYear}`, 155, certY); 
  
  doc.setFont("helvetica", "normal");
  doc.text("Sex", 175, certY);
  doc.setFont("helvetica", "bold");
  doc.text(record.gender === 'Male' ? 'M' : 'F', 185, certY);

  // Row 3: Employer Name & Address
  certY += 15;
  doc.setFont("helvetica", "normal");
  doc.text("Name & Address of Employer", col1X, certY);
  
  certY += 10;
  doc.setFont("helvetica", "bold");
  doc.text((record.companyName || "").toUpperCase(), col1X, certY);
  
  if (record.companyAddress) {
      certY += 5;
      doc.setFontSize(9);
      const splitAddress = doc.splitTextToSize(record.companyAddress.toUpperCase(), 160);
      doc.text(splitAddress, col1X, certY);
      certY += (splitAddress.length * 5);
  } else {
      certY += 10;
  }

  // Row 4: Results
  certY += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Examination/tests done and the results", col1X, certY);
  doc.setFont("helvetica", "bold");
  
  // Logic: If FIT -> NORMAL, if UNFIT -> ABNORMAL (basic assumption for cert)
  const examResult = (record.outcome === Outcome.FIT || record.outcome === Outcome.FIT_CONDITIONAL) ? "NORMAL." : "ABNORMAL.";
  doc.text(examResult, 100, certY);

  // Row 5: Certification Statement
  certY += 20;
  doc.setFont("helvetica", "normal");
  const visitDateStr = new Date(record.visitDate).toLocaleDateString('en-GB'); // DD/MM/YYYY format preference
  doc.text(`I hereby certify that I have examined the above-named person on   ${visitDateStr}`, col1X, certY);
  
  certY += 15;
  const chem = (record.summaryRecord?.chemicalName || "_________________").toUpperCase();
  // Fit vs Unfit text
  const fitnessText = (record.outcome === Outcome.FIT || record.outcome === Outcome.FIT_CONDITIONAL) ? "Fit" : "Unfit";
  doc.text(`and that he/she is ${fitnessText} for work which may expose him/her to   ${chem} .`, col1X, certY);

  // Row 6: Remarks
  certY += 20;
  doc.text("Remarks (if any)", col1X, certY);
  if (record.recommendation?.notesToEmployer) {
      certY += 7;
      doc.setFont("helvetica", "italic");
      const remarks = doc.splitTextToSize(record.recommendation.notesToEmployer, 150);
      doc.text(remarks, col1X, certY);
      certY += (remarks.length * 5);
  } else {
      certY += 20;
  }

  // Signature Section
  certY += 30;
  
  // Draw a rough signature curve using bezier logic or just text 'Signature'
  doc.setLineWidth(0.5);
  doc.setDrawColor(0);
  // doc.lines([[10, -10], [10, 10]], 150, certY); // Simple line if needed, but let's just place text
  
  // "Signature & Date" Label
  doc.setFont("helvetica", "normal");
  doc.text("Signature & Date", 150, certY);
  
  // Date below signature
  const signDate = record.recommendation?.date 
     ? new Date(record.recommendation.date).toLocaleDateString('en-GB') 
     : new Date().toLocaleDateString('en-GB');
  doc.text(signDate, 155, certY + 10);

  // Add a scribble for signature simulation
  doc.setLineWidth(1);
  doc.path([
      { op: 'm', c: [150, certY - 15] },
      { op: 'c', c: [160, certY - 25, 170, certY - 5, 180, certY - 15] },
      { op: 's', c: [160, certY - 15, 150, certY - 5, 160, certY - 20] } // simple swirl
  ]);
  
  doc.save(`${record.patientName.replace(/\s+/g, '_')}_Report.pdf`);
};
