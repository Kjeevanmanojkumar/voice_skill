-- Insert Skills
INSERT INTO skills (name, description, category, icon, difficulty_level, total_missions, estimated_hours) VALUES
('Electrical Technician', 'Learn electrical installation, maintenance, and troubleshooting through hands-on simulations', 'electrical', 'Zap', 3, 8, 40),
('Healthcare Assistant', 'Develop patient care skills, vital signs monitoring, and basic medical procedures', 'healthcare', 'Heart', 4, 8, 50),
('Carpentry & Woodwork', 'Master carpentry techniques, furniture making, and construction skills', 'carpentry', 'Hammer', 2, 8, 35),
('Computer Hardware Technician', 'Learn computer assembly, troubleshooting, and hardware maintenance', 'computer_hardware', 'Cpu', 3, 8, 45);

-- Electrical Missions
INSERT INTO missions (skill_id, title, description, scenario, voice_instructions, steps, materials, safety_notes, difficulty, duration_minutes, points, order_index) VALUES
((SELECT id FROM skills WHERE category = 'electrical'), 'Basic Circuit Connection', 
'Learn to connect a simple electrical circuit with switches and bulbs',
'You are in a workshop. A client needs a basic lighting circuit with one switch controlling two bulbs.',
'["Say connect wire to connect electrical components", "Say switch on to turn on the switch", "Say check circuit to verify your connections", "Say complete when finished"]'::jsonb,
'["Identify the power source and switch", "Connect the live wire to the switch input", "Connect switch output to first bulb", "Connect bulbs in parallel", "Connect neutral wire to complete circuit"]'::jsonb,
'["Wires (red, black, green)", "Switch", "2 Bulbs", "Screwdriver", "Wire stripper"]'::jsonb,
ARRAY['Always disconnect power before working', 'Check for live wires with tester', 'Use insulated tools', 'Ensure proper grounding'], 1, 15, 100, 1),

((SELECT id FROM skills WHERE category = 'electrical'), 'Install a Ceiling Fan',
'Install and wire a ceiling fan with speed controller',
'A home needs a ceiling fan installed in the bedroom with speed control functionality.',
'["Say attach bracket to mount the fan", "Say connect wires to wire the fan", "Say test fan to check operation", "Say complete when done"]'::jsonb,
'["Turn off main power supply", "Install mounting bracket on ceiling", "Assemble fan blades and motor", "Connect wires: blue for fan, red for light, white neutral", "Install speed regulator switch", "Test all speeds"]'::jsonb,
'["Ceiling fan unit", "Mounting bracket", "Speed regulator", "Wires", "Screwdriver set", "Ladder"]'::jsonb,
ARRAY['Turn off power at main switch', 'Support fan weight properly on ladder', 'Verify no overhead power lines', 'Have someone steady the ladder'], 2, 25, 150, 2),

((SELECT id FROM skills WHERE category = 'electrical'), 'Troubleshoot Faulty Wiring',
'Diagnose and fix common wiring faults in household circuits',
'A homeowner reports that some outlets are not working and there are occasional sparks from a switch.',
'["Say check outlet to inspect an outlet", "Say test wire to test connections", "Say fix connection to repair faults", "Say complete when repaired"]'::jsonb,
'["Interview homeowner about symptoms", "Check breaker panel for tripped breakers", "Test outlets with voltage tester", "Identify loose connections or damaged wires", "Replace faulty switch", "Verify all connections secure"]'::jsonb,
'["Multimeter", "Voltage tester", "Replacement switches", "Wire nuts", "Electrical tape", "Screwdriver"]'::jsonb,
ARRAY['Shut off power before touching wires', 'Assume all wires are live until tested', 'Use insulated tools only', 'Report major damage'], 3, 30, 200, 3),

((SELECT id FROM skills WHERE category = 'electrical'), 'Install Home Inverter System',
'Set up an inverter with battery backup for home power backup',
'Install a power backup inverter system for essential appliances during power outages.',
'["Say place inverter to position the unit", "Say connect battery for battery wiring", "Say connect mains for AC input", "Say test backup to verify operation"]'::jsonb,
'["Select appropriate location for inverter", "Install battery in ventilated area", "Connect battery cables (red positive, black negative)", "Connect AC input from mains", "Connect output to essential circuits", "Configure settings and test"]'::jsonb,
'["Inverter unit", "Battery (150Ah)", "Battery cables", "AC cables", "Switches", "Circuit breakers"]'::jsonb,
ARRAY['Battery emits hydrogen - keep ventilated', 'Do not smoke near battery', 'Wear safety glasses', 'Ensure proper polarity'], 4, 35, 250, 4),

((SELECT id FROM skills WHERE category = 'electrical'), 'Three-Phase Motor Connection',
'Connect and test a three-phase induction motor with starter',
'Install a three-phase motor for an industrial pump application.',
'["Say identify phases to mark phase connections", "Say connect starter for motor starter", "Say check rotation to verify direction", "Say complete when operational"]'::jsonb,
'["Identify R, Y, B phase connections", "Connect motor terminals to starter", "Configure star/delta connections", "Connect control circuit", "Check rotation direction", "Adjust connections if reversed"]'::jsonb,
'["Three-phase motor", "Starter (DOL/Star-Delta)", "Control cables", "Power cables", "Multimeter", "Phase rotation meter"]'::jsonb,
ARRAY['Locked rotor current is high - use proper starter', 'Verify phase sequence', 'Ensure proper earthing', 'Check motor insulation before connection'], 5, 40, 300, 5),

((SELECT id FROM skills WHERE category = 'electrical'), 'Home Electrical Inspection',
'Perform a complete electrical safety inspection of a residence',
'Conduct a thorough electrical inspection for a home being sold.',
'["Say check panel to inspect main panel", "Say check grounding to verify earthing", "Say check outlets to test receptacles", "Say generate report when complete"]'::jsonb,
'["Inspect main panel for proper breakers", "Check all connections are tight", "Test GFCI outlets functionality", "Verify proper grounding", "Check for outdated wiring", "Document all findings"]'::jsonb,
'["Multimeter", "Outlet tester", "Ground tester", "Flashlight", "Inspection checklist"]'::jsonb,
ARRAY['Do not touch exposed wiring', 'Report all hazards immediately', 'Document everything thoroughly', 'Recommend licensed electrician for repairs'], 3, 30, 200, 6),

((SELECT id FROM skills WHERE category = 'electrical'), 'Smart Home Installation',
'Install smart home devices including smart switches and sensors',
'Upgrade a home with smart home automation features.',
'["Say install hub to set up smart hub", "Say pair device to connect devices", "Say configure scene for automation", "Say test automation to verify setup"]'::jsonb,
'["Install smart home hub", "Replace switches with smart switches", "Install motion sensors", "Set up smart lighting", "Configure automation schedules", "Test voice commands"]'::jsonb,
'["Smart hub", "Smart switches", "Motion sensors", "Smart bulbs", "Mobile app", "WiFi router"]'::jsonb,
ARRAY['Turn off power before installing switches', 'Ensure WiFi coverage in all areas', 'Test all devices before finalizing', 'Document network passwords securely'], 4, 45, 280, 7),

((SELECT id FROM skills WHERE category = 'electrical'), 'Solar Panel Installation',
'Install and configure a rooftop solar panel system',
'Set up a residential rooftop solar power system.',
'["Say mount panel to install solar panel", "Say connect inverter for power conversion", "Say configure battery for storage", "Say test generation when ready"]'::jsonb,
'["Assess roof condition and orientation", "Calculate panel requirements", "Mount rails on roof", "Install solar panels on rails", "Connect panels in series/parallel", "Install inverter and connect to grid", "Configure monitoring system"]'::jsonb,
'["Solar panels", "Mounting rails", "Inverter", "DC cables", "MC4 connectors", "Earthing kit"]'::jsonb,
ARRAY['Work at height - use fall protection', 'DC power is always on when panels are sunny', 'Cover panels during installation', 'Ensure proper earthing'], 5, 60, 350, 8);

-- Healthcare Missions
INSERT INTO missions (skill_id, title, description, scenario, voice_instructions, steps, materials, safety_notes, difficulty, duration_minutes, points, order_index) VALUES
((SELECT id FROM skills WHERE category = 'healthcare'), 'Patient Vital Signs Assessment',
'Learn to measure and record vital signs accurately',
'You are a healthcare assistant. A new patient has arrived and needs baseline vital signs.',
'["Say measure pulse to check heart rate", "Say check blood pressure for BP", "Say measure temperature for fever check", "Say record vitals to document findings"]'::jsonb,
'["Greet patient and explain procedure", "Wash hands and don gloves", "Measure pulse rate for 60 seconds", "Check blood pressure with sphygmomanometer", "Measure temperature orally", "Record all vitals in patient chart", "Report abnormal findings to supervisor"]'::jsonb,
'["Stethoscope", "Blood pressure cuff", "Thermometer", "Pulse oximeter", "Gloves", "Patient chart"]'::jsonb,
ARRAY['Sanitize equipment between patients', 'Verify patient identity', 'Report critical values immediately', 'Maintain patient privacy'], 1, 20, 100, 1),

((SELECT id FROM skills WHERE category = 'healthcare'), 'Patient Mobility Assistance',
'Help patients with transfers and ambulation safely',
'An elderly patient needs assistance moving from bed to wheelchair for physical therapy.',
'["Say explain procedure to inform patient", "Say prepare wheelchair for setup", "Say assist transfer for safe movement", "Say secure patient for safety"]'::jsonb,
'["Assess patient condition and strength", "Explain the transfer process to patient", "Lock bed wheels and position wheelchair", "Apply transfer belt if available", "Support patient with proper body mechanics", "Assist patient to sitting position", "Pivot patient to wheelchair", "Secure patient and remove transfer belt"]'::jsonb,
'["Wheelchair", "Transfer belt", "Non-slip shoes for patient", "Gait belt"]'::jsonb,
ARRAY['Use proper body mechanics to prevent injury', 'Never lift with back bent', 'Get help for heavy patients', 'Check patient comfort after transfer'], 2, 25, 150, 2),

((SELECT id FROM skills WHERE category = 'healthcare'), 'Wound Care and Dressing',
'Clean and dress wounds following sterile technique',
'A patient has a moderate-sized wound from a fall that needs cleaning and dressing.',
'["Say set up supplies to prepare workspace", "Say clean wound for wound cleaning", "Say apply dressing for bandaging", "Say document care for records"]'::jsonb,
'["Set up sterile field", "Wash hands and don gloves", "Remove old dressing if present", "Clean wound from center outward", "Apply antibiotic ointment if ordered", "Apply sterile dressing", "Secure with tape", "Document wound appearance and care provided"]'::jsonb,
'["Sterile gloves", "Normal saline", "Gauze pads", "Sterile dressing", "Medical tape", "Antibiotic ointment", "Biohazard bag"]'::jsonb,
ARRAY['Maintain sterility - do not touch wound with non-sterile items', 'Dispose of contaminated materials properly', 'Report signs of infection', 'Check patient allergies before applying ointment'], 3, 30, 200, 3),

((SELECT id FROM skills WHERE category = 'healthcare'), 'Administering Medications',
'Safely administer oral and topical medications',
'A patient requires multiple medications at 10 AM. Verify all medications and administer safely.',
'["Say verify patient to check identity", "Say verify medication for safety check", "Say administer medication to give medicine", "Say document administration for records"]'::jsonb,
'["Verify patient identity with two identifiers", "Check medication order: name, dose, time, route", "Compare with label three times", "Check for allergies", "Explain medication to patient", "Administer oral medication with water", "Stay with patient until swallowed", "Document administration immediately"]'::jsonb,
'["Medication administration record", "Medications", "Water cup", "Pill crusher if needed", "Gloves"]'::jsonb,
ARRAY['The rights: Right patient, drug, dose, time, route, documentation', 'Check expiration dates', 'Never leave medications unattended', 'Report adverse reactions immediately', 'Verify allergies each time'], 3, 25, 200, 4),

((SELECT id FROM skills WHERE category = 'healthcare'), 'CPR and Emergency Response',
'Perform CPR and respond to cardiac emergency',
'A patient in the waiting room collapses. You need to initiate emergency response and CPR.',
'["Say assess responsiveness to check patient", "Say call for help to notify team", "Say begin CPR for chest compressions", "Say use AED for defibrillation"]'::jsonb,
'["Check scene safety", "Tap patient and shout - check responsiveness", "Call for help/activate emergency response", "Check for breathing and pulse (max 10 seconds)", "Begin chest compressions - 30 compressions", "Deliver 2 rescue breaths", "Continue 30:2 cycle", "When AED arrives, apply pads and follow prompts", "Continue until advanced help arrives"]'::jsonb,
'["CPR manikin for training", "AED trainer", "Pocket mask", "Gloves"]'::jsonb,
ARRAY['Scene safety first', 'Hard and fast compressions - 100-120/min', 'Minimize interruptions', 'If alone, call for help first if witnessed collapse', 'Use AED as soon as available'], 4, 35, 250, 5),

((SELECT id FROM skills WHERE category = 'healthcare'), 'Patient Hygiene Care',
'Provide complete bed bath and hygiene care',
'A bedridden patient needs complete hygiene care including bed bath and oral care.',
'["Say prepare supplies for setup", "Say wash face for facial care", "Say wash body for body cleaning", "Say oral care for mouth hygiene"]'::jsonb,
'["Gather supplies and prepare warm water", "Explain procedure to patient", "Maintain privacy - close curtains", "Wash face first with clean water", "Wash each body part systematically", "Dry thoroughly before moving to next area", "Provide oral care", "Change bed linens", "Position patient comfortably"]'::jsonb,
'["Basin with warm water", "Soap", "Washcloths", "Towels", "Clean gown", "Toothbrush and toothpaste", "Clean bed linens", "Waterproof pad"]'::jsonb,
ARRAY['Check water temperature before use', 'Expose only area being washed', 'Watch for signs of discomfort', 'Report any skin breakdown detected'], 2, 30, 150, 6),

((SELECT id FROM skills WHERE category = 'healthcare'), 'Blood Sample Collection',
'Perform venipuncture for blood sample collection',
'A patient needs blood drawn for routine lab work.',
'["Say greet patient to introduce yourself", "Say verify order to check lab request", "Say prepare equipment for supplies setup", "Say locate vein for site identification", "Say perform draw for venipuncture", "Say label sample for specimen handling"]'::jsonb,
'["Greet patient and verify identity", "Review lab order and confirm tests", "Explain procedure to patient", "Wash hands and put on gloves", "Apply tourniquet and locate vein", "Clean site with alcohol prep", "Perform venipuncture at appropriate angle", "Collect required tubes in order", "Release tourniquet, apply pressure", "Label tubes with patient info"]'::jsonb,
'["Tourniquet", "Vacutainer needles", "Blood collection tubes", "Alcohol preps", "Gauze", "Bandage", "Gloves", "Sharps container", "Lab labels"]'::jsonb,
ARRAY['Never reuse needles - dispose in sharps immediately', 'Maintain sterility of collection site', 'Verify tube order for multiple tests', 'Label tubes at bedside with patient present'], 4, 30, 250, 7),

((SELECT id FROM skills WHERE category = 'healthcare'), 'Diabetic Patient Care and Monitoring',
'Manage blood glucose monitoring and insulin administration',
'A diabetic patient needs morning blood glucose check and insulin administration.',
'["Say prepare glucometer for glucose check setup", "Say check glucose for blood sugar test", "Say verify insulin dosage for safety", "Say administer insulin for injection", "Say document results for records"]'::jsonb,
'["Gather supplies and wash hands", "Verify patient identity", "Explain procedure to patient", "Insert test strip into glucometer", "Perform finger stick on side of finger", "Apply blood drop to test strip", "Read and record glucose result", "Verify insulin dose with order", "Select injection site and rotate", "Administer subcutaneous injection at 90 degree angle", "Document procedure and result"]'::jsonb,
'["Glucometer", "Test strips", "Lancet device", "Insulin pen/syringe", "Alcohol preps", "Gloves", "Sharps container"]'::jsonb,
ARRAY['Check insulin expiration date', 'Rotate injection sites to prevent lipodystrophy', 'Do not inject into bruised or hardened areas', 'Monitor for hypoglycemia after insulin', 'Know hypoglycemia symptoms and treatment'], 4, 30, 280, 8);

-- Carpentry Missions
INSERT INTO missions (skill_id, title, description, scenario, voice_instructions, steps, materials, safety_notes, difficulty, duration_minutes, points, order_index) VALUES
((SELECT id FROM skills WHERE category = 'carpentry'), 'Basic Wood Joint - Butt Joint',
'Learn to create simple butt joints for basic woodworking',
'You need to join two pieces of wood to make a simple picture frame.',
'["Say mark cut for measurement", "Say cut wood for sawing", "Say apply glue for adhesive", "Say clamp pieces for assembly", "Say check square for accuracy"]'::jsonb,
'["Measure and mark both pieces", "Set saw to 90 degrees", "Cut both ends square", "Sand cut edges smooth", "Apply wood glue to joint", "Clamp and check for square", "Wipe excess glue", "Allow to dry for 30 minutes"]'::jsonb,
'["Two wood pieces", "Measuring tape", "Pencil", "Hand saw or circular saw", "Wood glue", "Clamps", "Sandpaper"]'::jsonb,
ARRAY['Keep fingers away from saw blade', 'Support wood firmly while cutting', 'Clamp workpiece before cutting', 'Wear safety glasses', 'Let glue set before moving'], 1, 15, 100, 1),

((SELECT id FROM skills WHERE category = 'carpentry'), 'Build a Wooden Shelf',
'Construct a wall-mounted wooden shelf',
'A client wants a simple wall-mounted shelf for their kitchen.',
'["Say measure wall for dimensions", "Say cut shelf board for main piece", "Say attach brackets for support", "Say level shelf for alignment", "Say secure to wall for mounting"]'::jsonb,
'["Measure wall space for shelf", "Mark and cut shelf board to length", "Sand all surfaces smooth", "Locate wall studs with finder", "Mark bracket positions level", "Install shelf brackets into studs", "Place shelf on brackets", "Secure shelf to brackets with screws"]'::jsonb,
'["Shelf board", "Shelf brackets", "Wood screws", "Wall anchors if no stud", "Level", "Drill", "Stud finder", "Sandpaper"]'::jsonb,
ARRAY['Always secure to studs when possible', 'Check electrical wires before drilling', 'Use appropriate screws for bracket size', 'Level before final securing'], 2, 30, 150, 2),

((SELECT id FROM skills WHERE category = 'carpentry'), 'Install Door Frame',
'Learn to install a door frame properly',
'Install a new door frame in a newly constructed room.',
'["Say measure opening for door size check", "Say assemble frame for jamb assembly", "Say plumb frame for vertical check", "Say secure frame for fastening", "Say hang door for door installation"]'::jsonb,
'["Measure door opening carefully", "Assemble door jamb pieces", "Insert frame into opening", "Level and plumb the frame", "Shim around frame at nail points", "Secure frame with screws through jamb", "Check door swings freely", "Install door with hinges"]'::jsonb,
'["Door frame kit", "Shims", "Wood screws", "Level", "Hammer", "Drill", "Door with hinges", "Measuring tape"]'::jsonb,
ARRAY['Frame must be perfectly plumb and level', 'Use shims at all fastening points', 'Do not force frame - it will warp', 'Keep expansion gap around door'], 3, 45, 200, 3),

((SELECT id FROM skills WHERE category = 'carpentry'), 'Construct Wooden Cabinet Box',
'Build a basic cabinet box structure',
'Build a lower cabinet box for a kitchen installation.',
'["Say cut panels for box pieces", "Say join sides for assembly", "Say install back for rear panel", "Say add bottom for base", "Say check square for alignment"]'::jsonb,
'["Cut two side panels", "Cut top and bottom panels", "Cut back panel from plywood", "Join sides to bottom with screws and glue", "Attach back panel for square", "Install cleats for countertop support", "Check entire box for square", "Sand all surfaces"]'::jsonb,
'["Plywood sheets", "1x4 lumber for face frame", "Wood screws", "Wood glue", "Cabinet hardware", "Drill", "Circular saw", "Clamps", "Sandpaper"]'::jsonb,
ARRAY['Pre-drill holes to prevent splitting', 'Use pocket screws for strong joints', 'Back panel ensures square box', 'Check measurements twice'], 4, 60, 250, 4),

((SELECT id FROM skills WHERE category = 'carpentry'), 'Create Mortise and Tenon Joint',
'Learn traditional joinery technique',
'For a high-quality furniture project, create mortise and tenon joints.',
'["Say mark mortise for cavity layout", "Say cut mortise for joint cavity", "Say mark tenon for plug sizing", "Say cut tenon for joint plug", "Say test fit for joint check"]'::jsonb,
'["Mark mortise location on one piece", "Use mortise gauge for width", "Drill out mortise waste", "Chisel mortise square", "Mark and cut tenon to fit mortise", "Test fit - should be snug", "Apply glue and assemble", "Clamp until dry"]'::jsonb,
'["Two matching boards", "Mortise gauge", "Chisel set", "Drill with bits", "Tenon saw", "Marking knife", "Clamps", "Wood glue"]'::jsonb,
ARRAY['Tenon should be 1/3 of board thickness', 'Cut tenon slightly thick, then trim', 'Square shoulders are critical', 'Test fit before gluing'], 3, 35, 200, 5),

((SELECT id FROM skills WHERE category = 'carpentry'), 'Install Laminate Flooring',
'Install click-lock laminate flooring in a room',
'Install laminate flooring in a 12x15 bedroom.',
'["Say prepare floor for surface prep", "Say install underlay for moisture barrier", "Say start first row for initial boards", "Say continue laying for board placement", "Say install trim for finishing"]'::jsonb,
'["Remove existing flooring if needed", "Clean and level subfloor", "Install underlayment/vapor barrier", "Start first row along longest wall", "Click boards together at angle", "Stagger joints by at least 8 inches", "Cut boards at walls leaving 1/4 inch gap", "Install transitions and baseboard"]'::jsonb,
'["Laminate flooring boxes", "Underlayment", "Transition strips", "Baseboard/trim", "Spacers", "Tapping block", "Pull bar", "Circular saw or jigsaw"]'::jsonb,
ARRAY['Expansion gap is mandatory - floor expands', 'Do not force boards - they should click easily', 'Keep joints staggered', 'Work from multiple boxes for coloring'], 3, 45, 200, 6),

((SELECT id FROM skills WHERE category = 'carpentry'), 'Design and Build a Workbench',
'Build a sturdy workshop workbench',
'A workshop needs a new sturdy workbench with storage shelf.',
'["Say cut legs for support pieces", "Say assemble frame for structure", "Say install top for work surface", "Say add shelf for storage", "Say square and secure for final assembly"]'::jsonb,
'["Cut four legs from 4x4", "Cut stretchers from 2x4", "Assemble front and back frames", "Join frames with side stretchers", "Install plywood top", "Add bottom shelf framework", "Install shelf plywood", "Add vise if needed"]'::jsonb,
'["4x4 posts for legs", "2x4 lumber for frame", "3/4 inch plywood for top and shelf", "Wood screws (3 inch and 1.5 inch)", "Bolt for vise", "Drill", "Circular saw", "Square", "Level"]'::jsonb,
ARRAY['Height should suit user - typically 35-38 inches', 'Frame must be square before adding top', 'Top overhangs frame by 2 inches for clamping', 'Use construction adhesive on joints'], 4, 60, 280, 7),

((SELECT id FROM skills WHERE category = 'carpentry'), 'Kitchen Cabinet Installation',
'Install upper and lower kitchen cabinets',
'Install base and wall cabinets in a kitchen renovation.',
'["Say mark layout for cabinet positions", "Say install wall cabinets first for uppers", "Say install base cabinets for lowers", "Say join cabinets for unit connection", "Say install countertop for finish"]'::jsonb,
'["Mark cabinet positions on wall", "Find and mark stud locations", "Install wall cabinet ledger board", "Hang wall cabinets starting from corner", "Level and secure wall cabinets", "Install base cabinets starting from corner", "Shim cabinets level and plumb", "Join cabinets together securely", "Install countertop", "Add hardware and finish trim"]'::jsonb,
'["Base cabinets", "Wall cabinets", "Countertop", "Cabinet screws", "Shims", "Level", "Drill", "Clamps", "Jigsaw for cutouts"]'::jsonb,
ARRAY['Wall cabinets go first - no obstruction', 'Always screw into studs', 'Corner cabinets establish layout', 'Leave proper gaps for appliances'], 5, 90, 350, 8);

-- Computer Hardware Missions
INSERT INTO missions (skill_id, title, description, scenario, voice_instructions, steps, materials, safety_notes, difficulty, duration_minutes, points, order_index) VALUES
((SELECT id FROM skills WHERE category = 'computer_hardware'), 'Desktop PC Assembly',
'Assemble a desktop computer from components',
'A client needs a custom PC assembled for office work.',
'["Say install motherboard for mainboard setup", "Say install CPU for processor mounting", "Say install RAM for memory", "Say install storage for drives", "Say connect power for PSU setup", "Say test boot for verification"]'::jsonb,
'["Install I/O shield in case", "Install motherboard standoffs", "Install CPU in socket (check alignment)", "Apply thermal paste pea-sized", "Install CPU cooler", "Install RAM in correct slots", "Install motherboard in case", "Install power supply", "Connect 24-pin and CPU power", "Install SSD/HDD", "Connect case front panel", "Connect fans", "First boot test"]'::jsonb,
'["Motherboard", "CPU", "RAM", "SSD", "Power supply", "Case", "CPU cooler", "Thermal paste", "Screwdriver"]'::jsonb,
ARRAY['Ground yourself - static kills components', 'Check CPU socket alignment carefully', 'Do not over-tighten cooler', 'Double-check power connections before boot', 'Manage cables for airflow'], 2, 40, 150, 1),

((SELECT id FROM skills WHERE category = 'computer_hardware'), 'Troubleshoot No Boot Issue',
'Diagnose why a computer turns on but does not display',
'A customer brought in a PC that powers on but shows no display on the monitor.',
'["Say check monitor for display issues", "Say check RAM for memory problems", "Say check cables for connections", "Say check GPU for graphics issues", "Say clear CMOS for BIOS reset"]'::jsonb,
'["Verify monitor works and is connected", "Check power lights on PC", "Remove and reseat RAM", "Try one RAM stick at a time", "Reseat graphics card", "Check all power cables", "Clear CMOS by removing battery", "Listen for beep codes", "Test with minimal components"]'::jsonb,
'["Multimeter", "Replacement RAM for testing", "POST card (optional)", "Thermal paste", "Compressed air", "Working monitor for testing"]'::jsonb,
ARRAY['Work systematically - change one thing at a time', 'Disconnect power before touching components', 'Note beep codes if present', 'Document changes made'], 3, 30, 200, 2),

((SELECT id FROM skills WHERE category = 'computer_hardware'), 'Install Operating System',
'Install Windows/Linux on a new computer',
'A newly built PC needs Windows 11 installed.',
'["Say prepare install media for USB setup", "Say enter BIOS for boot settings", "Say boot from USB for installer start", "Say partition drive for disk setup", "Say complete setup for OS installation"]'::jsonb,
'["Create Windows installation USB", "Connect USB and power on", "Enter BIOS/UEFI (F2, Del, F12)", "Set boot order to USB first", "Save and reboot", "Follow Windows Setup screens", "Select Custom install", "Partition drive or delete existing", "Complete regional and account setup", "Install drivers from manufacturer"]'::jsonb,
'["8GB+ USB drive", "Windows ISO file", "Rufus tool for creating bootable USB", "Driver downloads ready", "Product key if required"]'::jsonb,
ARRAY['Backup any existing data before install', 'Have drivers ready before disconnecting', 'Ensure proper partition for OS', 'Note Windows key for activation'], 2, 30, 150, 3),

((SELECT id FROM skills WHERE category = 'computer_hardware'), 'Data Recovery from Failed Drive',
'Recover data from a failing hard drive',
'A customer has a drive that clicks and is not recognized. Need to recover family photos.',
'["Say assess drive for failure type", "Say try basic recovery for simple cases", "Say use recovery software for software issues", "Say attempt clone for failing drives"]'::jsonb,
'["Connect drive to working PC", "Listen for clicking (mechanical failure)", "Test in BIOS if detected", "If detected - try Recuva or similar", "If clicking - do not power on repeatedly", "If accessible - immediately copy data", "If mechanical failure - recommend professional recovery", "Clone drive to new one if possible"]'::jsonb,
'["USB to SATA adapter", "Working computer", "Recovery software (Recuva, TestDisk)", "New drive for cloning", "SATA cables", "External enclosure"]'::jsonb,
ARRAY['Clicking = mechanical failure - stop powering on', 'More you try, worse it gets for mechanical', 'Software only helps with logical corruption', 'Professional recovery expensive but sometimes necessary'], 4, 35, 250, 4),

((SELECT id FROM skills WHERE category = 'computer_hardware'), 'Laptop Screen Replacement',
'Replace broken laptop display panel',
'A laptop arrived with a cracked screen. Replace with a new panel.',
'["Say remove battery for power safety", "Say remove bezel for frame access", "Say disconnect old panel for removal", "Say install new panel for replacement", "Say test display for verification"]'::jsonb,
'["Power off and unplug laptop", "Remove battery if accessible", "Remove screws from bezel (may be under rubber covers)", "Pry off bezel carefully", "Disconnect LCD cable and webcam cable", "Remove screws holding panel", "Remove old panel", "Connect cable to new panel", "Secure new panel with screws", "Reconnect cables and reassemble", "Test display before closing"]'::jsonb,
'["New LCD panel matching model", "Screwdriver set (small Phillips)", "Plastic pry tools", "Anti-static wrist strap"]'::jsonb,
ARRAY['Disconnect battery first - avoid shorts', 'Panel is fragile - handle by edges', 'Keep track of screw locations', 'Ground yourself before handling components'], 3, 35, 200, 5),

((SELECT id FROM skills WHERE category = 'computer_hardware'), 'BIOS/UEFI Configuration',
'Configure BIOS settings for optimal performance',
'Configure a new PC BIOS for optimal settings.',
'["Say enter BIOS for setup access", "Say check boot order for boot sequence", "Say configure XMP for RAM speed", "Say enable virtualization for VM support", "Say save settings for configuration save"]'::jsonb,
'["Enter BIOS (watch screen for key)", "Check system information for CPU/RAM", "Set boot order", "Enable XMP for RAM rated speed", "Enable virtualization (VT-x/AMD-V)", "Set date and time", "Configure fan curves if available", "Set supervisor password if needed", "Save and exit (F10)"]'::jsonb,
'["Computer motherboard manual", "Pen and paper for noting settings"]'::jsonb,
ARRAY['Write down changes made', 'Do not change unknown settings', 'XMP may cause instability - test', 'Keep BIOS password safe if set'], 2, 20, 120, 6),

((SELECT id FROM skills WHERE category = 'computer_hardware'), 'Network Card Installation',
'Install a PCIe network card and configure drivers',
'A desktop needs a faster network card for better connectivity.',
'["Say open case for access", "Say install card for PCIe insertion", "Say connect antenna for wireless", "Say install drivers for software", "Say test connection for verification"]'::jsonb,
'["Power off and unplug PC", "Open case side panel", "Find empty PCIe slot", "Remove rear bracket cover", "Insert network card firmly", "Secure with bracket screw", "Close case and reconnect", "Power on and install drivers", "Configure network settings", "Test connection speed"]'::jsonb,
'["PCIe network card", "Screwdriver", "Driver CD or download ready", "Antenna if applicable"]'::jsonb,
ARRAY['Ground yourself before handling card', 'Card should click into PCIe slot', 'Do not force - gentle pressure', 'Update drivers from manufacturer website'], 2, 25, 130, 7),

((SELECT id FROM skills WHERE category = 'computer_hardware'), 'Power Supply Testing and Replacement',
'Test and replace a failing power supply',
'A PC randomly shuts down. Suspect the power supply.',
'["Say test PSU with tester for initial check", "Say remove old PSU for power supply removal", "Say install new PSU for replacement", "Say connect all cables for wiring", "Say test system for verification"]'::jsonb,
'["Disconnect all PSU cables", "Use PSU tester or multimeter", "Check voltages: 3.3V, 5V, 12V", "If outside 5% tolerance - replace PSU", "Remove old PSU from case", "Install new PSU with same or higher wattage", "Connect 24-pin motherboard power", "Connect 4/8-pin CPU power", "Connect GPU power if needed", "Connect SATA/Molex to drives", "Cable management", "Test boot and verify voltages in BIOS"]'::jsonb,
'["PSU tester", "Multimeter", "Replacement power supply", "Cable ties for management", "Screwdriver"]'::jsonb,
ARRAY['Capacitors hold charge - do not open PSU', 'Never run PSU without load', 'Wattage should exceed system needs', 'Quality matters - use reputable brands'], 3, 40, 220, 8);

-- Insert Assessments for each skill
INSERT INTO assessments (skill_id, title, description, questions, passing_score, time_limit_minutes, max_attempts)
SELECT id, 'Electrical Safety Fundamentals', 'Test your knowledge of electrical safety and procedures',
'[{"q": "What should you do first before starting any electrical work?", "options": ["Turn off the main power", "Put on gloves", "Check with multimeter", "Read the manual"], "correct": 0}, {"q": "What color wire is typically used for grounding?", "options": ["Red", "Black", "Green", "Blue"], "correct": 2}, {"q": "What is the purpose of a circuit breaker?", "options": ["Increase voltage", "Protect from overload", "Convert AC to DC", "Store electricity"], "correct": 1}, {"q": "What should you check before touching any wire?", "options": ["Its color", "If it is live using a tester", "Its thickness", "The time of day"], "correct": 1}, {"q": "GFCI outlets are designed to protect against:", "options": ["Overvoltage", "Ground faults and electrocution", "Power surges", "Radio interference"], "correct": 1}, {"q": "The live wire in most countries is typically:", "options": ["Green/yellow", "Blue", "Brown or Black", "White"], "correct": 2}, {"q": "Proper earthing protects by:", "options": ["Increasing current flow", "Providing path for fault current", "Reducing voltage", "Storing excess power"], "correct": 1}, {"q": "Before installing a ceiling fan, you must:", "options": ["Turn off the room lights", "Turn off the main power", "Open the windows", "Remove old fan first"], "correct": 1}, {"q": "What is the safest tool to use when working on live circuits?", "options": ["Metal pliers", "Insulated screwdriver", "Bare hands", "Any screwdriver"], "correct": 1}, {"q": "Three-phase power is commonly used in:", "options": ["Small homes", "Industrial applications", "Mobile phones", "Battery circuits"], "correct": 1}]'::jsonb,
80, 20, 3
FROM skills WHERE category = 'electrical';

INSERT INTO assessments (skill_id, title, description, questions, passing_score, time_limit_minutes, max_attempts)
SELECT id, 'Healthcare Assistant Certification', 'Comprehensive test of patient care knowledge',
'[{"q": "What are the normal blood pressure ranges for adults?", "options": ["150/100 mmHg", "90-120/60-80 mmHg", "200/150 mmHg", "80/40 mmHg"], "correct": 1}, {"q": "How long should you wash your hands?", "options": ["5 seconds", "At least 20 seconds", "1 minute", "Only before eating"], "correct": 1}, {"q": "When administering medication, verify:", "options": ["Only the name", "Patient identity, drug, dose, route, time", "Only the dose", "Only the time"], "correct": 1}, {"q": "The correct CPR compression rate is:", "options": ["60 per minute", "100-120 per minute", "200 per minute", "As fast as possible"], "correct": 1}, {"q": "Before transferring a patient, you should:", "options": ["Just lift them", "Assess their condition and explain", "Call family first", "Give them medication"], "correct": 1}, {"q": "Signs of wound infection include:", "options": ["Pale skin", "Redness, swelling, warmth, drainage", "Decreased pain", "Faster healing"], "correct": 1}, {"q": "What is hypoglycemia?", "options": ["High blood sugar", "Low blood sugar", "Normal blood sugar", "High blood pressure"], "correct": 1}, {"q": "When drawing blood, the tourniquet should be released:", "options": ["Before needle insertion", "After blood enters tube, before needle removal", "Never", "One hour later"], "correct": 1}, {"q": "Standard precautions mean treating:", "options": ["Only known infected patients specially", "All blood/body fluids as potentially infectious", "Only surgical patients", "Only elderly patients"], "correct": 1}, {"q": "For proper body mechanics during lifting:", "options": ["Bend at waist", "Keep back straight, bend knees, lift with legs", "Hold breath", "Twist while lifting"], "correct": 1}]'::jsonb,
80, 25, 3
FROM skills WHERE category = 'healthcare';

INSERT INTO assessments (skill_id, title, description, questions, passing_score, time_limit_minutes, max_attempts)
SELECT id, 'Carpentry Fundamentals', 'Test your carpentry knowledge and safety awareness',
'[{"q": "Before making a cut, you should always:", "options": ["Start sawing immediately", "Measure twice, cut once", "Use the dullest saw", "Close your eyes"], "correct": 1}, {"q": "What is the purpose of sanding wood?", "options": ["To make it heavier", "To smooth surfaces and remove roughness", "To add color", "To measure it"], "correct": 1}, {"q": "When using a circular saw, what should you wear?", "options": ["Sandals", "Safety glasses and hearing protection", "Jewelry", "Loose clothing"], "correct": 1}, {"q": "A mortise and tenon joint is used for:", "options": ["Temporary connections", "Strong permanent joints", "Decorative purposes only", "Electrical connections"], "correct": 1}, {"q": "Why must you leave expansion gaps in laminate flooring?", "options": ["To make installation harder", "Material expands with temperature/humidity changes", "For aesthetics", "To waste material"], "correct": 1}, {"q": "When installing wall cabinets in a kitchen:", "options": ["Install base cabinets first", "Install wall cabinets first", "Install randomly", "Install trim first"], "correct": 1}, {"q": "What tool ensures a door frame is perfectly vertical?", "options": ["Tape measure", "Level", "Hammer", "Saw"], "correct": 1}, {"q": "Why use shims when installing cabinets?", "options": ["Decoration", "To level and plumb the cabinets", "To add weight", "For sound dampening"], "correct": 1}, {"q": "Wood glue should be:", "options": ["Applied only on one surface", "Applied to both surfaces and clamped", "Mixed with water", "Applied after assembly"], "correct": 1}, {"q": "Before drilling into a wall, you should check for:", "options": ["Wallpaper pattern", "Electrical wires and pipes", "Paint color", "Room temperature"], "correct": 1}]'::jsonb,
80, 20, 3
FROM skills WHERE category = 'carpentry';

INSERT INTO assessments (skill_id, title, description, questions, passing_score, time_limit_minutes, max_attempts)
SELECT id, 'Computer Hardware Technician', 'Test your computer hardware knowledge',
'[{"q": "What should you do first before working on computer components?", "options": ["Turn on the PC", "Ground yourself to prevent static damage", "Wet your hands", "Remove all cables"], "correct": 1}, {"q": "The CPU socket has alignment markers to:", "options": ["Make it look nice", "Prevent incorrect CPU installation", "Increase speed", "Add more connectors"], "correct": 1}, {"q": "What does RAM stand for?", "options": ["Random Access Memory", "Read All Memory", "Run Active Mode", "Remote Access Module"], "correct": 0}, {"q": "Thermal paste is applied between:", "options": ["Motherboard and case", "CPU and cooler", "RAM and slot", "GPU and monitor"], "correct": 1}, {"q": "What should you do if a drive is clicking?", "options": ["Keep trying to access it", "Stop powering it on - likely mechanical failure", "Hit it gently", "Install new software"], "correct": 1}, {"q": "BIOS stands for:", "options": ["Basic Input Output System", "Binary Internal Operating System", "Basic Internet Operating System", "Binary Input Output Service"], "correct": 0}, {"q": "The 24-pin connector powers the:", "options": ["CPU", "Motherboard", "GPU", "Hard drive"], "correct": 1}, {"q": "What tool helps diagnose boot issues with beep codes?", "options": ["POST card", "Screwdriver", "Monitor", "Keyboard"], "correct": 0}, {"q": "Before installing a PCIe card, you should:", "options": ["Turn on the PC", "Disconnect power and ground yourself", "Remove the CPU", "Install drivers first"], "correct": 1}, {"q": "When replacing laptop screen, remove battery first because:", "options": ["Its lighter", "To prevent short circuits", "Battery covers the screen", "To see better"], "correct": 1}]'::jsonb,
80, 20, 3
FROM skills WHERE category = 'computer_hardware';