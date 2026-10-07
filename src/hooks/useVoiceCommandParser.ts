import { useCallback, useRef, useEffect } from 'react';
import { useFormStore } from '../store/useFormStore';
import { useThemeStore } from '../store/useThemeStore';

/**
 * Clean and format spoken transcript for simple form field filling.
 * Supports date conversion (e.g. "10th Feb 2005" -> "2005-02-10"),
 * email formatting ("name at gmail dot com" -> "name@gmail.com"),
 * numbers, phones, and select/radio options.
 */
export function cleanSpokenValue(
  rawTranscript: string,
  fieldType?: string,
  options?: { label: string; value: string }[]
): any {
  if (!rawTranscript) return '';
  let text = rawTranscript.trim();

  // Strip conversational carrier phrases if present
  text = text
    .replace(
      /^(my\s+(name|email|phone|city|address|age|number|dob|date of birth)\s+is|mera\s+(naam|email|phone|shahar|pata|umar|number|janm tithi)\s+hai|mera\s+naam\s+hai|my\s+name\s+is|i\s+am|main\s+hoon|enter|fill|set)\s+/i,
      ''
    )
    .replace(/\s+(hai|tha|hoga|karo|dalo|likho)$/i, '')
    .trim();

  // Date Parsing: Converts spoken dates into standard HTML5 date format (YYYY-MM-DD)
  if (fieldType === 'date') {
    const months: Record<string, string> = {
      jan: '01', january: '01', janwari: '01', 'जनवरी': '01',
      feb: '02', february: '02', farwari: '02', 'फरवरी': '02',
      mar: '03', march: '03', 'मार्च': '03',
      apr: '04', april: '04', 'अप्रैल': '04',
      may: '05', mai: '05', 'मई': '05',
      jun: '06', june: '06', 'जून': '06',
      jul: '07', july: '07', 'जुलाई': '07',
      aug: '08', august: '08', 'अगस्त': '08',
      sep: '09', sept: '09', september: '09', 'सितंबर': '09',
      oct: '10', october: '10', 'अक्टूबर': '10',
      nov: '11', november: '11', 'नवंबर': '11',
      dec: '12', december: '12', 'दिसंबर': '12'
    };

    // Remove ordinals (10th -> 10, 1st -> 1, 2nd -> 2, 3rd -> 3)
    const cleanDateText = text.replace(/(\d+)(st|nd|rd|th)/gi, '$1');

    // Pattern 1: Day Month Year (e.g., "10 Feb 2005" or "10 February 2005")
    const dmyWord = cleanDateText.match(/(\d{1,2})[\s\-\/]+([a-zA-Z\u0900-\u097F]+)[\s\-\/]+(\d{4})/);
    if (dmyWord) {
      const day = dmyWord[1].padStart(2, '0');
      const mKey = dmyWord[2].toLowerCase();
      const month = months[mKey] || '01';
      const year = dmyWord[3];
      return `${year}-${month}-${day}`;
    }

    // Pattern 2: Month Day Year (e.g., "Feb 10 2005" or "February 10 2005")
    const mdyWord = cleanDateText.match(/([a-zA-Z\u0900-\u097F]+)[\s\-\/]+(\d{1,2})[\s\-\/]+(\d{4})/);
    if (mdyWord) {
      const mKey = mdyWord[1].toLowerCase();
      const month = months[mKey] || '01';
      const day = mdyWord[2].padStart(2, '0');
      const year = mdyWord[3];
      return `${year}-${month}-${day}`;
    }

    // Pattern 3: Digits DD/MM/YYYY or DD-MM-YYYY
    const dmyDigits = cleanDateText.match(/(\d{1,2})[\s\-\/\.]+(\d{1,2})[\s\-\/\.]+(\d{4})/);
    if (dmyDigits) {
      const day = dmyDigits[1].padStart(2, '0');
      const month = dmyDigits[2].padStart(2, '0');
      const year = dmyDigits[3];
      return `${year}-${month}-${day}`;
    }

    // Pattern 4: Already ISO YYYY-MM-DD
    const isoMatch = cleanDateText.match(/(\d{4})[\s\-\/]+(\d{1,2})[\s\-\/]+(\d{1,2})/);
    if (isoMatch) {
      const year = isoMatch[1];
      const month = isoMatch[2].padStart(2, '0');
      const day = isoMatch[3].padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }

  if (fieldType === 'number') {
    const devanagariDigits: Record<string, string> = {
      '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
      '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
    };
    const normalized = text.replace(/[०-९]/g, (d) => devanagariDigits[d] || d);
    const match = normalized.match(/-?\d+(\.\d+)?/);
    return match ? Number(match[0]) : normalized;
  }

  if (fieldType === 'email') {
    return text
      .toLowerCase()
      .replace(/\s*(at the rate of|at the rate|at rate|at)\s*/gi, '@')
      .replace(/@\s+/g, '@')
      .replace(/\s+@/g, '@')
      .replace(/\s*(dot|point)\s*/gi, '.')
      .replace(/\.\s+/g, '.')
      .replace(/\s+\./g, '.')
      .replace(/\s+/g, '');
  }

  if (fieldType === 'phone') {
    const devanagariDigits: Record<string, string> = {
      '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
      '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
    };
    return text
      .replace(/[०-९]/g, (d) => devanagariDigits[d] || d)
      .replace(/[^\d+ -]/g, '')
      .replace(/\s+/g, '');
  }

  if (fieldType === 'checkbox') {
    return /yes|haan|sure|true|yep|definitely|sahi|theek|ha/i.test(text);
  }

  if (fieldType === 'select' || fieldType === 'radio') {
    if (options && options.length > 0) {
      const lower = text.toLowerCase();
      const matched = options.find(
        (o) =>
          o.value.toLowerCase() === lower ||
          o.label.toLowerCase() === lower ||
          lower.includes(o.label.toLowerCase()) ||
          lower.includes(o.value.toLowerCase())
      );
      if (matched) return matched.value;
    }
  }

  return text;
}

/**
 * Hook for voice data capture:
 * Automatically and immediately sets the active/focused form field with spoken text.
 * Maintains an activeFieldKeyRef to avoid stale closures.
 */
export function useVoiceCommandParser() {
  const { addToast } = useThemeStore();
  const activeFieldKey = useFormStore((state) => state.activeFieldKey);

  // Keep a ref perpetually in sync with the latest activeFieldKey
  const activeFieldKeyRef = useRef(activeFieldKey);
  useEffect(() => {
    activeFieldKeyRef.current = activeFieldKey;
  }, [activeFieldKey]);

  const parseCommand = useCallback(
    (transcript: string, explicitTargetKey?: string) => {
      if (!transcript || !transcript.trim()) return;

      const {
        activeTemplate,
        activeFieldKey: storeActiveKey,
        setFieldValue,
        pendingVoiceConfirmation,
        setPendingVoiceConfirmation,
        confirmPendingVoiceChange,
        rejectPendingVoiceChange
      } = useFormStore.getState();

      // If a confirmation modal is currently open, handle voice answer ("haan" / "nahi")
      if (pendingVoiceConfirmation) {
        const lower = transcript.toLowerCase().trim();
        const isPositive =
          /(^|\b)(haan|ha|sahi|sahi hai|confirm|yes|theek hai|bilkul|correct|yep|yeah|kar do|save|save karo)(\b|$)/i.test(lower);
        const isNegative =
          /(^|\b)(nahi|na|galat|galat hai|dobara|no|nope|cancel|retry|wrong|phir se|dobara bolo)(\b|$)/i.test(lower);

        if (isPositive) {
          confirmPendingVoiceChange();
          addToast({
            type: 'success',
            title: `${pendingVoiceConfirmation.fieldLabel} Confirmed`,
            message: `"${pendingVoiceConfirmation.value}" successfully saved.`
          });
          return;
        }

        if (isNegative) {
          rejectPendingVoiceChange();
          addToast({
            type: 'info',
            title: 'Dobara Boliye',
            message: `Please speak your ${pendingVoiceConfirmation.fieldLabel} again.`
          });
          return;
        }

        // Ignore other speech while confirmation modal is pending
        return;
      }

      // 1. Determine target field: explicit argument > ref > store state > first template field
      let targetFieldKey = explicitTargetKey || activeFieldKeyRef.current || storeActiveKey;

      // 2. Intelligent field detection if user specifically names a field
      // e.g. "email is test@example.com" or "phone 9876543210"
      if (activeTemplate) {
        const lowerTranscript = transcript.toLowerCase();
        for (const field of activeTemplate.fields) {
          const keyMatch = field.key.toLowerCase();
          const labelMatch = field.label.toLowerCase();
          const hasFieldPrefix =
            lowerTranscript.startsWith(keyMatch + ' ') ||
            lowerTranscript.startsWith(labelMatch + ' ') ||
            lowerTranscript.includes(`my ${keyMatch} is`) ||
            lowerTranscript.includes(`my ${labelMatch} is`) ||
            lowerTranscript.includes(`mera ${keyMatch}`) ||
            lowerTranscript.includes(`mera ${labelMatch}`);

          if (hasFieldPrefix) {
            targetFieldKey = field.key;
            break;
          }
        }
      }

      // 3. Fallback to first field only if absolutely no field was ever active
      if (!targetFieldKey && activeTemplate && activeTemplate.fields.length > 0) {
        targetFieldKey = activeTemplate.fields[0].key;
      }

      if (!targetFieldKey) return;

      const targetField = activeTemplate?.fields.find((f) => f.key === targetFieldKey);
      const cleanedValue = cleanSpokenValue(transcript, targetField?.type, targetField?.options);

      // 4. SENSITIVE FIELD CONFIRMATION:
      // If the targeted field is marked sensitive (Aadhaar, Phone, Email, DOB, Bank Account, etc.),
      // do NOT set the field value immediately! Trigger confirmation modal & TTS verification.
      if (targetField?.isSensitive) {
        setPendingVoiceConfirmation({
          fieldKey: targetFieldKey,
          fieldLabel: targetField.label || targetFieldKey,
          value: cleanedValue,
          rawTranscript: transcript
        });
        return;
      }

      // 5. Non-sensitive fields continue to fill directly without interruption
      setFieldValue(targetFieldKey, cleanedValue, {
        logAi: true,
        label: targetField?.label || targetFieldKey,
        description: `Voice value set for ${targetField?.label || targetFieldKey}: "${cleanedValue}"`
      });

      addToast({
        type: 'success',
        title: `${targetField?.label || 'Field'} Filled`,
        message: `"${cleanedValue}"`
      });
    },
    [addToast]
  );

  return { parseCommand, activeFieldKeyRef };
}
