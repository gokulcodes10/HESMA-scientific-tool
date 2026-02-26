package com.smac.demo.service;

import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.sl.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import com.smac.demo.model.Element;

@Service
public class ExcelService {

    public List<Element> loadElements(String filePath) throws Exception {

        List<Element> elements = new ArrayList<>();
        FileInputStream fis = new FileInputStream(filePath);
        Workbook workbook = new XSSFWorkbook(fis);
        org.apache.poi.ss.usermodel.Sheet sheet = workbook.getSheetAt(0);

        for (Row row : sheet) {
            Element element = new Element();
            element.setSymbol(row.getCell(0).getStringCellValue());
            element.setAtomicRadius(row.getCell(1).getNumericCellValue());
            element.setMeltingPoint(row.getCell(2).getNumericCellValue());
            element.setElectronegativity(row.getCell(3).getNumericCellValue());

            elements.add(element);
        }

        workbook.close();
        return elements;
    }
}