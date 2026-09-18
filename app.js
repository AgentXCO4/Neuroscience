const STORAGE_KEY = 'neuropath_progress_v2';
const defaultState = {
  unlocked: 0,
  completed: {},
  quizBest: {},
  xp: 0,
  badges: [],
  lastOpened: 0
};

let state;
try {
  state = Object.assign({}, defaultState, JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));
} catch {
  state = { ...defaultState };
}
state.completed = state.completed && typeof state.completed === 'object' ? state.completed : {};
state.quizBest = state.quizBest && typeof state.quizBest === 'object' ? state.quizBest : {};
state.badges = Array.isArray(state.badges) ? state.badges : [];
state.unlocked = Number.isInteger(state.unlocked) ? state.unlocked : 0;
state.xp = Number.isFinite(state.xp) ? state.xp : 0;
state.lastOpened = Number.isInteger(state.lastOpened) ? state.lastOpened : 0;

const courses = [
  {
    id:'foundations', title:'Foundations of Neuroscience', blurb:'How scientists study the nervous system, cells, signals, and the language of anatomy.', level:'Foundation', time:'15 min',
    sections:[
      {title:'What is neuroscience?', content:[
        ['p','Neuroscience is the study of the nervous system: the brain, spinal cord, and the networks that connect the body. It includes anatomy, physiology, behavior, development, disease, and many other fields.'],
        ['h4','The big map'],
        ['p','The nervous system is often divided into the central nervous system (CNS), which contains the brain and spinal cord, and the peripheral nervous system (PNS), which includes nerves and ganglia outside the CNS.'],
        ['diagram',[['Central nervous system','Brain + spinal cord'],['Peripheral nervous system','Nerves + ganglia'],['Goal','Move and process information']]],
        ['p','For your future neurosurgeon brain, start by asking three questions about any structure: Where is it? What connects to it? What does it do?']
      ], callout:'Good science is often just careful observation followed by good questions.', terms:['neuroscience','central nervous system','peripheral nervous system']},
      {title:'A scientist’s toolkit', content:[
        ['p','Scientists use several kinds of evidence. Anatomy tells us where structures are. Physiology tells us how they work. Imaging lets us observe structures in living people. Experiments help test specific ideas.'],
        ['h4','Think like a scientist'],
        ['ul',['Define the question clearly.','Separate what is observed from what is guessed.','Check whether evidence supports the conclusion.','Be willing to revise your idea when new evidence appears.']],
        ['p','Medicine is built on this habit. A confident guess is still a guess until evidence supports it.']
      ], callout:'Remember: learning medicine is not memorizing everything. It is learning how the pieces fit together.', terms:['anatomy','physiology','evidence']},
      {title:'Checkpoint: body directions', content:[
        ['p','Before moving forward, practice the basic location words scientists use. Superior means toward the head. Inferior means toward the feet. Anterior means toward the front. Posterior means toward the back.'],
        ['h4','Why this matters'],
        ['p','Neuroscience uses precise location language because the nervous system is a three dimensional map. Precise words prevent confusing two structures that sit close together.']
      ], quiz:{question:'Which word means toward the back of the body?', options:['Anterior','Posterior','Superior','Inferior'], correct:1, why:'Posterior describes a position toward the back.'}, terms:['superior','inferior','anterior','posterior']}
    ]
  },
  {
    id:'cells', title:'Cells, Tissues & the Brain’s Building Blocks', blurb:'Cells, organelles, tissues, and the special jobs that make nervous tissue work.', level:'Foundation', time:'18 min',
    sections:[
      {title:'Cells make the nervous system', content:[
        ['p','The brain is made of cells. Neurons are specialized for communication, while glial cells help support the environment in which neurons work.'],
        ['h4','A tiny city'],
        ['diagram',[['Cell membrane','Controls what crosses'],['Nucleus','Stores genetic information'],['Mitochondria','Make usable cellular energy']]],
        ['p','Every cell needs energy. Neurons are especially dependent on a steady supply of energy because they maintain electrical and chemical gradients across their membranes.']
      ], callout:'The brain looks complicated, but it is built from ordinary biological rules repeated at enormous scale.', terms:['neuron','glia','cell membrane','nucleus','mitochondria']},
      {title:'Neurons', content:[
        ['p','A neuron has specialized regions that help it receive, process, and send information. Many neurons have dendrites, a cell body called the soma, and an axon.'],
        ['diagram',[['Dendrites','Often receive input'],['Soma','Contains nucleus + cell machinery'],['Axon','Carries signals toward targets']]],
        ['p','Not every neuron has exactly the same shape. Nervous systems contain many cell types adapted for different tasks.']
      ], terms:['dendrite','soma','axon']},
      {title:'Glia and myelin', content:[
        ['p','Glial cells are not simply background filler. Different glial populations support neurons in different ways, including maintaining the local environment, forming myelin, and helping with repair and defense.'],
        ['h4','Myelin'],
        ['p','Myelin is an insulating layer around many axons. It helps electrical signals travel efficiently. In the peripheral nervous system, Schwann cells form myelin. In the central nervous system, oligodendrocytes form myelin.']
      ], quiz:{question:'Which structure carries many neuronal signals away from the cell body?', options:['Dendrite','Axon','Nucleus','Synaptic cleft'], correct:1, why:'The axon commonly carries signals from the cell body toward target cells.'}, callout:'Checkpoint quiz: get this one right before the next stage unlocks.', terms:['myelin','Schwann cell','oligodendrocyte']}
    ]
  },
  {
    id:'neuron-anatomy', title:'Neuron Anatomy', blurb:'Trace a signal from a neuron’s input regions to its output regions.', level:'Core', time:'16 min',
    sections:[
      {title:'The neuron map', content:[['p','A useful first model is input → integration → output. Dendrites often receive input, the cell body supports the cell, and the axon carries signals toward its terminals.'],['diagram',[['Input','Dendrites + other receptive regions'],['Integration','Cell body / axon initial segment'],['Output','Axon terminals + synapses']]],['p','This is a teaching model, not a rigid rule. Real neurons can be more varied.']], terms:['input','integration','output']},
      {title:'Axon terminals and synapses', content:[['p','At an axon terminal, a neuron can communicate with another cell at a synapse. The receiving cell might be another neuron, a muscle cell, or a gland cell.'],['h4','Why the ending matters'],['p','The axon is not just a wire. Its terminal regions contain molecular machinery that lets the neuron communicate with its target.']], terms:['axon terminal','target cell','synapse']},
      {title:'The axon initial segment', content:[['p','The axon initial segment is an important region near the start of the axon. In many neurons, it is a site where the membrane can reach the conditions needed to trigger an action potential.'],['p','That makes it a useful landmark when learning how incoming signals become outgoing electrical signals.']], quiz:{question:'Which region is a common site for action potential initiation?',options:['Axon initial segment','Nucleus','Dendritic spine','Cerebellum'],correct:0,why:'The axon initial segment is a common site for action potential initiation in many neurons.'}, terms:['axon initial segment','action potential']}
    ]
  },
  {
    id:'resting', title:'Resting Membrane Potential', blurb:'Why a neuron at rest has a voltage difference across its membrane.', level:'Core', time:'18 min',
    sections:[
      {title:'Voltage across a membrane', content:[['p','A resting neuron has a voltage difference across its cell membrane. A typical textbook value is around −70 mV, but the exact value varies among cells.'],['p','This voltage exists because ions are distributed unevenly across the membrane and the membrane has selective permeability.']],callout:'Think of the membrane as a controlled border, not an open doorway.',terms:['membrane potential','ion gradient','selective permeability']},
      {title:'Sodium and potassium', content:[['p','Sodium (Na⁺) and potassium (K⁺) are especially important when studying neuronal electrical behavior. At rest, many potassium leak pathways contribute to the membrane being more negative inside than outside.'],['p','The sodium potassium pump uses energy to help maintain sodium and potassium gradients over time. The pump is important, but it is not the only thing creating the immediate voltage difference.']],terms:['Na⁺','K⁺','sodium potassium pump','leak channel']},
      {title:'Checkpoint: why negative?', content:[['p','The inside of a resting neuron is negative relative to the outside because of the combined effects of ion concentrations, selective membrane permeability, and charged molecules inside the cell.'],['h4','A useful mental model'],['p','Unequal ion distribution + selective permeability + active maintenance = a stable resting voltage.']],quiz:{question:'Which ion commonly has a major influence on the resting membrane potential through leak pathways?',options:['Potassium','Iron','Calcium only','DNA'],correct:0,why:'Potassium leak conductance is an important contributor to resting membrane potential.'},terms:['resting potential','K⁺ leak','ion gradient']}
    ]
  },
  {
    id:'action', title:'Action Potentials', blurb:'Follow the famous electrical sequence: threshold, depolarization, repolarization, and recovery.', level:'Core', time:'25 min', lab:true,
    sections:[
      {title:'Threshold and the rising phase', content:[['p','An action potential is a rapid, characteristic change in membrane voltage in an excitable cell. In many neurons, reaching threshold near the axon initial segment opens enough voltage gated sodium channels to produce a regenerative rising phase.'],['p','Sodium ions move into the cell through open voltage gated sodium channels, making the membrane voltage rapidly more positive.']],callout:'Threshold is not a magical number carved into the brain. It is a useful model for understanding when a self reinforcing action potential begins.',terms:['threshold','voltage gated sodium channel','depolarization']},
      {title:'Peak and repolarization', content:[['p','Near the peak, sodium channels become inactivated while potassium channel activity becomes important. Potassium ions leave the cell, helping the membrane voltage move back toward negative values.'],['p','This falling phase is called repolarization. The exact timing of channel states is more nuanced than a simple one switch at a time story.']],terms:['repolarization','K⁺ efflux','Na⁺ channel inactivation']},
      {title:'Hyperpolarization and refractory period', content:[['p','Potassium conductance can remain elevated briefly, pushing the membrane voltage below its resting value. This is called after hyperpolarization.'],['p','During the refractory period, generating another action potential is harder or temporarily impossible depending on the phase. This helps shape how quickly neurons can fire again.']],quiz:{question:'Which ion movement is especially associated with the falling phase of a typical action potential?',options:['K⁺ moving out','Na⁺ moving in','DNA moving out','Glucose moving through the nucleus'],correct:0,why:'Potassium movement out through open potassium channels contributes to repolarization.'},terms:['hyperpolarization','refractory period']}
    ]
  },
  {
    id:'synapses', title:'Synapses & Neurotransmitters', blurb:'How neurons communicate with neurons, muscles, and glands.', level:'Core', time:'22 min',
    sections:[
      {title:'Chemical synapses', content:[['p','At many synapses, an electrical signal arriving at the axon terminal causes calcium entry. Calcium helps trigger synaptic vesicles to release neurotransmitter into the synaptic cleft.'],['p','The neurotransmitter then binds receptors on the target cell and changes its activity.']],terms:['synaptic cleft','vesicle','calcium','receptor']},
      {title:'Excitatory and inhibitory', content:[['p','A neurotransmitter is not automatically excitatory or inhibitory in every situation. The effect depends on the receptor and the target cell. Some receptor effects make an action potential more likely; others make it less likely.'],['h4','Reuptake and breakdown'],['p','Neurotransmitter signals can end through reuptake, enzymatic breakdown, diffusion, or other mechanisms depending on the system.']],callout:'The receptor matters as much as the neurotransmitter name.',terms:['excitatory','inhibitory','reuptake','enzyme']},
      {title:'Checkpoint: the handoff', content:[['p','Picture the sequence: action potential arrives → calcium enters terminal → vesicles release neurotransmitter → neurotransmitter binds receptors → target cell changes activity.']],quiz:{question:'What helps trigger neurotransmitter release from many presynaptic terminals?',options:['Calcium entry','Bone growth','DNA replication','Air pressure'],correct:0,why:'Calcium entry into the presynaptic terminal helps trigger vesicle fusion and neurotransmitter release.'},terms:['presynaptic','postsynaptic','vesicle fusion']}
    ]
  },
  {
    id:'spinal', title:'Spinal Cord & Reflexes', blurb:'Learn the cord’s basic organization and why some responses can be rapid.', level:'Core', time:'20 min',
    sections:[
      {title:'The spinal cord', content:[['p','The spinal cord is part of the central nervous system and connects the brain with many parts of the body. It also contains circuits that can process certain information locally.'],['p','Gray matter contains many neuronal cell bodies and synapses. White matter contains many myelinated axons organized into pathways.']],terms:['spinal cord','gray matter','white matter']},
      {title:'Reflex arcs', content:[['p','A reflex arc is a circuit that can produce a rapid, relatively automatic response to a stimulus. Sensory information enters the nervous system, circuits process it, and motor output can activate muscles.'],['p','The brain can still receive information about many reflexes even when the initial response is coordinated at the spinal level.']],terms:['reflex arc','sensory neuron','motor neuron']},
      {title:'Checkpoint: gray or white?', content:[['p','As a memory trick, think of gray matter as rich in cell bodies and synapses, while white matter is rich in myelinated axons. In the spinal cord, these are arranged differently from their common arrangement in the cerebral cortex.']],quiz:{question:'Which tissue is especially rich in myelinated axons?',options:['White matter','Gray matter','Bone marrow','Cartilage'],correct:0,why:'White matter contains many myelinated axons, giving it its lighter appearance.'},terms:['tract','dorsal','ventral']}
    ]
  },
  {
    id:'cranial', title:'Cranial Nerves', blurb:'Map the twelve cranial nerves and the broad functions they support.', level:'Core', time:'24 min',
    sections:[
      {title:'Why cranial nerves matter', content:[['p','Cranial nerves connect the brain or brainstem with structures in the head and neck, and some extend farther into the body. They carry sensory signals, motor commands, or both.'],['p','There are twelve pairs, usually numbered with Roman numerals I through XII.']],terms:['cranial nerve','sensory','motor','Roman numeral']},
      {title:'The twelve nerve map', content:[['diagram',[['I Olfactory','Smell'],['II Optic','Vision'],['III Oculomotor','Many eye movements'],['IV Trochlear','Eye movement'],['V Trigeminal','Face sensation + chewing'],['VI Abducens','Eye movement'],['VII Facial','Facial movement + taste'],['VIII Vestibulocochlear','Hearing + balance'],['IX Glossopharyngeal','Taste + throat functions'],['X Vagus','Broad parasympathetic + visceral roles'],['XI Accessory','Certain neck + shoulder movements'],['XII Hypoglossal','Tongue movement']]],['p','The goal at first is recognition, not perfect memorization. Learn a few at a time and keep returning to the map.']],terms:['olfactory','optic','trigeminal','facial','vagus']},
      {title:'Checkpoint: build the map', content:[['p','Try to remember at least the name and broad function of the first six cranial nerves before moving on. Then quiz yourself on the rest tomorrow.']],quiz:{question:'Which cranial nerve is strongly associated with hearing and balance?',options:['V Trigeminal','VIII Vestibulocochlear','X Vagus','II Optic'],correct:1,why:'Cranial nerve VIII is the vestibulocochlear nerve, associated with hearing and balance.'},terms:['CN I','CN II','CN V','CN VII','CN VIII','CN X','CN XII']}
    ]
  },
  {
    id:'brain', title:'Major Brain Anatomy', blurb:'Build a mental map of the cerebrum, cerebellum, brainstem, and deep brain structures.', level:'Core', time:'25 min',
    sections:[
      {title:'The cerebrum', content:[['p','The cerebrum contains two cerebral hemispheres and is involved in many functions including voluntary movement, sensation, language, memory, and complex cognition.'],['h4','The four familiar lobes'],['diagram',[['Frontal','Planning + movement + other functions'],['Parietal','Body sensation + spatial processing'],['Temporal','Hearing + memory + other functions'],['Occipital','Visual processing']]],['p','These lobe labels are useful landmarks, but real brain functions are networks rather than one box per job.']],terms:['cerebrum','frontal lobe','parietal lobe','temporal lobe','occipital lobe']},
      {title:'Cerebellum and brainstem', content:[['p','The cerebellum is strongly involved in coordination, balance, timing, and motor learning. The brainstem includes the midbrain, pons, and medulla and contains pathways and nuclei important for many functions.'],['p','The brainstem is especially important because it links the brain with the spinal cord and contains circuits involved in essential functions and reflexes.']],terms:['cerebellum','midbrain','pons','medulla']},
      {title:'Deep structures', content:[['p','Structures such as the thalamus, hypothalamus, hippocampus, and basal ganglia are major landmarks in brain anatomy. Each belongs to larger networks rather than working alone.']],quiz:{question:'Which structure is strongly involved in coordination and motor learning?',options:['Cerebellum','Occipital lobe','Thalamus only','Skull'],correct:0,why:'The cerebellum contributes strongly to coordination, balance, timing, and motor learning.'},terms:['thalamus','hypothalamus','hippocampus','basal ganglia']}
    ]
  },
  {
    id:'brainstem', title:'Brainstem & Cerebellum', blurb:'Go deeper on two crucial regions with dense pathways and specialized circuits.', level:'Core', time:'21 min',
    sections:[
      {title:'Brainstem landmarks', content:[['p','The brainstem is made of the midbrain, pons, and medulla. It contains ascending and descending pathways, cranial nerve nuclei, and networks involved in arousal and autonomic functions.'],['diagram',[['Midbrain','Upper brainstem region'],['Pons','Bridge like central region'],['Medulla','Lower brainstem region']]]],terms:['midbrain','pons','medulla oblongata']},
      {title:'Cerebellar circuits', content:[['p','The cerebellum receives information about movement and the body and compares signals to help tune motor output. It is also important for motor learning.'],['p','Think of it as a calibration system. It helps make movement more accurate rather than simply issuing the original command.']],callout:'A better movement is often a movement that has been corrected by feedback.',terms:['motor learning','coordination','feedback']},
      {title:'Checkpoint: brainstem basics', content:[['p','The brainstem is not just a cable. It contains important neural circuits and nuclei. The cerebellum is not just a balance center. Both are complex networks with many roles.']],quiz:{question:'Which three structures make up the brainstem?',options:['Frontal, parietal, temporal','Midbrain, pons, medulla','Thalamus, hippocampus, cerebellum','Cortex, spinal cord, optic nerve'],correct:1,why:'The brainstem consists of the midbrain, pons, and medulla.'},terms:['brainstem','cerebellum','motor learning']}
    ]
  },
  {
    id:'deep', title:'Thalamus, Hypothalamus & Limbic Structures', blurb:'Explore important deep brain structures and how they fit into networks.', level:'Core', time:'22 min',
    sections:[
      {title:'Thalamus', content:[['p','The thalamus is a major relay and processing region for many kinds of sensory and motor information. It also participates in attention, arousal, and other brain networks.'],['p','A useful first idea is relay plus integration. The thalamus is more than a passive switchboard.']],terms:['thalamus','relay','integration']},
      {title:'Hypothalamus', content:[['p','The hypothalamus helps coordinate homeostasis and links nervous system activity with endocrine and autonomic functions. It contributes to regulation of temperature, hunger, thirst, sleep wake rhythms, and more.']],terms:['hypothalamus','homeostasis','autonomic','endocrine']},
      {title:'Hippocampus and amygdala', content:[['p','The hippocampus is important for memory formation and related learning processes. The amygdala is involved in emotional processing and threat related learning. Both participate in broader networks.']],quiz:{question:'Which structure is especially associated with memory formation?',options:['Hippocampus','Medulla','Occipital pole only','Spinal disc'],correct:0,why:'The hippocampus is strongly involved in memory formation and related learning.'},terms:['hippocampus','amygdala','memory']}
    ]
  },
  {
    id:'pathways', title:'Sensory & Motor Pathways', blurb:'Trace information through the nervous system instead of memorizing isolated parts.', level:'Core', time:'24 min',
    sections:[
      {title:'Sensory pathways', content:[['p','Sensory systems carry information from receptors toward the spinal cord and brain. Different pathways carry different types of information, and many eventually reach the thalamus and cerebral cortex.'],['p','The key skill is tracing direction: receptor → peripheral nerve → spinal cord or brainstem → higher centers.']],terms:['sensory receptor','ascending pathway','cortex']},
      {title:'Motor pathways', content:[['p','Motor systems carry commands from the brain toward muscles. Upper motor neuron pathways and lower motor neuron pathways work together to turn plans into movement.'],['p','Some motor control is direct, while other movement is shaped by circuits involving the basal ganglia and cerebellum.']],terms:['motor pathway','upper motor neuron','lower motor neuron','basal ganglia']},
      {title:'Checkpoint: trace it', content:[['p','When you study a pathway, always mark the starting point, major relay points, crossing points, and destination. Drawing the path beats rereading the paragraph five times.']],quiz:{question:'Which direction describes an ascending sensory pathway?',options:['From receptors toward the brain','From brain toward muscles','From skin toward a bone only','From heart toward the lungs'],correct:0,why:'Ascending sensory pathways carry information toward higher centers in the nervous system.'},terms:['ascending','descending','decussation']}
    ]
  },
  {
    id:'blood', title:'Brain Blood Supply', blurb:'Learn why brain tissue depends on circulation and how major arteries create a vascular map.', level:'Core', time:'23 min',
    sections:[
      {title:'Why blood flow matters', content:[['p','Brain cells need oxygen and glucose continuously. Blood flow delivers these resources and removes waste. Because neural function depends on energy, interruptions to blood supply can become serious quickly.'],['p','This is one reason vascular anatomy matters so much in neurology and neurosurgery.']],callout:'The brain has energy demands that make circulation a core neuroscience topic.',terms:['cerebral blood flow','oxygen','glucose']},
      {title:'Major arteries', content:[['p','The internal carotid arteries and vertebral arteries contribute to the arterial supply of the brain. Their branches create networks that supply different regions.'],['p','The circle of Willis is an arterial connection at the base of the brain that can provide collateral pathways, though its anatomy varies among people.']],terms:['internal carotid','vertebral artery','circle of Willis','collateral circulation']},
      {title:'Checkpoint: vascular thinking', content:[['p','When studying cerebral blood flow, think in maps: artery → major branches → territory → possible neurological effects when blood flow is disrupted.']],quiz:{question:'What does the circle of Willis refer to?',options:['An arterial connection at the base of the brain','A cranial nerve','A type of brain cell','A layer of the skull'],correct:0,why:'The circle of Willis is an arterial connection at the base of the brain.'},terms:['artery','territory','vascular territory']}
    ]
  },
  {
    id:'meninges', title:'Meninges & Cerebrospinal Fluid', blurb:'Study the layers and fluid systems that protect and support the brain and spinal cord.', level:'Core', time:'20 min',
    sections:[
      {title:'Three protective layers', content:[['p','The meninges are connective tissue layers around the brain and spinal cord. From outer to inner they are dura mater, arachnoid mater, and pia mater.'],['diagram',[['Dura mater','Tough outer layer'],['Arachnoid mater','Middle membrane'],['Pia mater','Thin layer closely following nervous tissue']]]],terms:['dura mater','arachnoid mater','pia mater']},
      {title:'Cerebrospinal fluid', content:[['p','Cerebrospinal fluid (CSF) circulates through spaces around the brain and spinal cord and through the ventricular system. It helps provide mechanical support and participates in the nervous system environment.']],terms:['cerebrospinal fluid','CSF','ventricle']},
      {title:'Checkpoint: the layers', content:[['p','Memorize the outer to inner order. Then practice locating the subarachnoid space and remembering that CSF circulates there around the brain and spinal cord.']],quiz:{question:'Which meningeal layer is closest to the surface of the brain?',options:['Dura mater','Arachnoid mater','Pia mater','Skull periosteum'],correct:2,why:'The pia mater closely follows the surface of the brain and spinal cord.'},terms:['subarachnoid space','ventricular system']}
    ]
  },
  {
    id:'plasticity', title:'Neuroplasticity & Memory', blurb:'Learn how experience can change neural connections and support learning.', level:'Core', time:'22 min',
    sections:[
      {title:'Plasticity', content:[['p','Neuroplasticity is the nervous system’s ability to change its structure or function in response to experience, learning, development, or injury.'],['p','Changes can involve synapses, dendrites, network activity, and other biological processes.']],callout:'The brain is not a frozen circuit board. Its connections can change.',terms:['neuroplasticity','synapse','learning']},
      {title:'Memory is a network story', content:[['p','Memory is not stored in one tiny brain box. Different kinds of memory involve distributed networks. The hippocampus is important for many processes involved in forming new memories, while long term knowledge and skills involve broader systems.'],['p','Sleep, attention, repetition, and meaningful practice can all influence learning.']],terms:['memory consolidation','hippocampus','attention']},
      {title:'Checkpoint: learning biology', content:[['p','When you study repeatedly, you are giving your nervous system repeated opportunities to strengthen and reorganize connections. The precise mechanisms depend on the kind of learning.']],quiz:{question:'What does neuroplasticity describe?',options:['The ability of the nervous system to change with experience','The skull becoming flexible','Blood becoming thicker','A type of cranial nerve'],correct:0,why:'Neuroplasticity refers to changes in nervous system structure or function associated with experience and other conditions.'},terms:['long term potentiation','memory consolidation']}
    ]
  },
  {
    id:'sleep', title:'Sleep, Consciousness & Arousal', blurb:'Explore how brain networks support sleep, wakefulness, attention, and conscious experience.', level:'Core', time:'21 min',
    sections:[
      {title:'Sleep is active biology', content:[['p','Sleep is not simply the brain turning off. Different sleep states have characteristic patterns of brain activity, body physiology, and network behavior.'],['p','The brain cycles through non REM and REM sleep across the night.']],terms:['sleep','non REM','REM']},
      {title:'Arousal and attention', content:[['p','Brainstem and forebrain networks help regulate arousal and wakefulness. Attention depends on coordinated activity across many brain regions rather than one attention switch.']],terms:['arousal','attention','brainstem']},
      {title:'Checkpoint: the brain at night', content:[['p','Sleep helps support memory, learning, and many other physiological functions. Scientists still investigate exactly how different sleep processes produce their effects.']],quiz:{question:'Which statement is most accurate?',options:['Sleep is an active biological state','Sleep means all brain activity stops','REM means no brain activity','Attention only uses one brain region'],correct:0,why:'Sleep involves active, organized changes in brain and body physiology.'},terms:['wakefulness','circadian rhythm']}
    ]
  },
  {
    id:'disorders', title:'Neurological Disorders', blurb:'Learn how changes in brain circuits can produce recognizable neurological patterns.', level:'Applied', time:'24 min',
    sections:[
      {title:'Stroke', content:[['p','A stroke occurs when brain blood flow is interrupted or when a blood vessel in the brain leaks or ruptures. Ischemic stroke and hemorrhagic stroke are different mechanisms.'],['p','Neurological symptoms depend on the location and extent of tissue affected. In real life, sudden neurological symptoms are an emergency.']],callout:'For study: location matters. For real life: sudden neurological changes need urgent medical attention.',terms:['stroke','ischemic','hemorrhagic']},
      {title:'Epilepsy', content:[['p','Epilepsy is a neurological disorder characterized by a tendency to have recurrent unprovoked seizures. Seizures involve abnormal, excessive, or synchronized neuronal activity.'],['p','Different seizure types can look very different, which is why careful classification matters.']],terms:['epilepsy','seizure','neuronal activity']},
      {title:'Brain tumors and degeneration', content:[['p','Brain tumors can arise from different cell types and may affect the nervous system through growth, pressure, or invasion. Neurodegenerative diseases involve progressive dysfunction and loss of neurons or neural networks in specific patterns.']],quiz:{question:'Why can the location of a brain lesion affect the symptoms it causes?',options:['Different regions participate in different functions','All brain regions do exactly the same job','The skull controls every symptom','Lesions never affect function'],correct:0,why:'Different neural regions and networks contribute to different functions, so lesion location matters.'},terms:['lesion','neurodegenerative','neurological deficit']}
    ]
  },
  {
    id:'clinical', title:'Clinical Reasoning Basics', blurb:'Practice turning observations into a careful neurological problem statement.', level:'Applied', time:'24 min',
    sections:[
      {title:'History comes first', content:[['p','Clinicians gather a history: what happened, when it started, what makes it better or worse, and what symptoms occur together. The time course can provide major clues.'],['p','Good reasoning separates facts from interpretations.']],terms:['history','time course','symptom']},
      {title:'Neurological examination', content:[['p','A neurological examination can include mental status, cranial nerves, strength, reflexes, sensation, coordination, and gait. Each part tests parts of the nervous system.'],['p','The goal is not to hunt for a single magic test. It is to build a coherent map of what works and what does not.']],terms:['reflex','sensation','coordination','gait']},
      {title:'Checkpoint: localization', content:[['p','Neurologic localization means using the pattern of findings to estimate where in the nervous system a problem could be. It is a reasoning skill built from anatomy and physiology.']],quiz:{question:'What is neurological localization?',options:['Using symptom patterns to estimate where a nervous system problem is located','Naming every brain cell','Measuring shoe size','Choosing a surgery before an exam'],correct:0,why:'Localization uses neurological findings and anatomy to estimate where a problem lies.'},terms:['localization','neurological exam']}
    ]
  },
  {
    id:'imaging', title:'Brain Imaging', blurb:'Meet CT, MRI, angiography, and the idea of matching images to anatomy.', level:'Applied', time:'22 min',
    sections:[
      {title:'CT', content:[['p','Computed tomography uses x rays and computer processing to create cross sectional images. CT is fast and can be especially useful in urgent settings.'],['p','It is one of the tools clinicians use to look for bleeding, fractures, and other abnormalities.']],terms:['CT','computed tomography','x ray']},
      {title:'MRI', content:[['p','Magnetic resonance imaging uses magnetic fields and radiofrequency energy to create detailed images of tissues. Different sequences highlight different tissue properties.'],['p','MRI is especially useful for many brain and spinal cord questions.']],terms:['MRI','magnetic resonance imaging','sequence']},
      {title:'Checkpoint: compare the tools', content:[['p','An image only becomes useful when you know what it can show well and what its limitations are. Real clinical decisions often use several pieces of evidence together.']],quiz:{question:'Which modality is especially known for detailed soft tissue imaging of the brain?',options:['MRI','Plain shoe scan','Thermometer','Stethoscope'],correct:0,why:'MRI provides excellent soft tissue contrast and is widely used for brain imaging.'},terms:['angiography','contrast','slice']}
    ]
  },
  {
    id:'surgery', title:'Neurosurgery Foundations', blurb:'Learn what neurosurgeons actually operate on and the principles behind safe surgical thinking.', level:'Advanced', time:'25 min',
    sections:[
      {title:'What neurosurgeons treat', content:[['p','Neurosurgeons operate on conditions involving the brain, spine, peripheral nerves, and related structures. Examples include certain tumors, vascular problems, traumatic injuries, and spinal disorders.'],['p','Many neurological conditions are not treated with surgery, so neurosurgical thinking starts with deciding whether an operation is appropriate at all.']],callout:'Surgery is a tool, not the definition of a disease.',terms:['neurosurgery','brain tumor','spine','peripheral nerve']},
      {title:'Safety and planning', content:[['p','Surgical planning uses anatomy, imaging, the patient’s symptoms, risks, goals, and available treatment options. A good operation begins long before the first incision.'],['p','Surgeons also work with anesthesiologists, nurses, radiologists, neurologists, and many other professionals.']],terms:['preoperative planning','anatomy','risk','team']},
      {title:'Checkpoint: the surgeon’s mindset', content:[['p','A neurosurgeon needs a precise anatomical map, careful risk thinking, technical skill, and the humility to keep learning.']],quiz:{question:'What should come before deciding on a neurosurgical procedure?',options:['Careful evaluation and treatment planning','Guessing from one symptom','Ignoring imaging','Skipping the history'],correct:0,why:'Surgical decisions require careful evaluation, diagnosis, planning, risks, goals, and alternatives.'},terms:['indication','risk benefit','informed consent']}
    ]
  },
  {
    id:'vascular', title:'Neurovascular Foundations', blurb:'Understand arteries, veins, aneurysms, and the logic of vascular neurosurgery.', level:'Advanced', time:'24 min',
    sections:[
      {title:'Arteries and veins', content:[['p','Arteries bring blood toward brain tissue, while veins return blood away. Brain vessels have specialized anatomy and tight relationships with neural structures.'],['p','Vascular neurosurgery deals with diseases such as aneurysms, arteriovenous malformations, and selected vascular malformations.']],terms:['artery','vein','aneurysm','AVM']},
      {title:'Aneurysms and AVMs', content:[['p','An aneurysm is a localized abnormal bulging of a blood vessel wall. An arteriovenous malformation (AVM) is an abnormal connection between arteries and veins.'],['p','These are complex conditions that require specialized imaging and multidisciplinary decision making.']],terms:['aneurysm','arteriovenous malformation','vascular malformation']},
      {title:'Checkpoint: vascular vocabulary', content:[['p','Your job is to know the vocabulary and the anatomy first. Detailed clinical management comes much later in formal medical training.']],quiz:{question:'What is an aneurysm?',options:['A localized abnormal bulging of a blood vessel wall','A type of neuron','A cranial nerve','A bone fracture'],correct:0,why:'An aneurysm is a localized abnormal bulging or dilation of a blood vessel wall.'},terms:['vascular','malformation','hemorrhage']}
    ]
  },
  {
    id:'spine', title:'Spine & Spinal Surgery Foundations', blurb:'Study vertebrae, discs, spinal nerves, and the basic anatomy around the spinal cord.', level:'Advanced', time:'24 min',
    sections:[
      {title:'The vertebral column', content:[['p','The vertebral column surrounds and protects the spinal cord while providing support and movement. It is divided into cervical, thoracic, lumbar, sacral, and coccygeal regions.'],['p','Different regions have different shapes and roles.']],terms:['vertebra','cervical','thoracic','lumbar']},
      {title:'Discs and nerve roots', content:[['p','Intervertebral discs help distribute loads between vertebrae. Spinal nerve roots leave the vertebral canal through openings and carry sensory and motor information.'],['p','When learning spine anatomy, connect the bones to the cord, meninges, roots, muscles, and vessels around them.']],terms:['intervertebral disc','nerve root','vertebral canal']},
      {title:'Checkpoint: spinal map', content:[['p','The strongest learners can draw the spinal column and identify where the cord, roots, vertebrae, and discs sit relative to one another.']],quiz:{question:'What is one major role of the vertebral column?',options:['Protect and support the spinal cord and body','Make neurotransmitters in the cortex','Control vision directly','Store all memories'],correct:0,why:'The vertebral column supports the body and helps protect the spinal cord.'},terms:['spinal cord','nerve root','disc']}
    ]
  },
  {
    id:'consciousness', title:'Consciousness & Brain Death', blurb:'Study consciousness scientifically and distinguish different states of impaired brain function.', level:'Advanced', time:'25 min',
    sections:[
      {title:'Consciousness as a brain function', content:[['p','Consciousness is studied as an emergent function of interacting brain networks involved in wakefulness, awareness, attention, and information processing. Scientists still investigate exactly how these processes are generated.'],['p','Neurology distinguishes wakefulness from awareness because they can be affected differently.']],terms:['consciousness','wakefulness','awareness']},
      {title:'Coma and unresponsive wakefulness', content:[['p','Coma is a state of profound unconsciousness with no normal wakefulness. Unresponsive wakefulness syndrome, formerly often called the vegetative state, involves periods of wakefulness without clear evidence of awareness. These states are medically distinct from one another and from brain death.']],callout:'These are clinical terms with specific meanings. Do not use them casually as synonyms.',terms:['coma','unresponsive wakefulness syndrome']},
      {title:'Brain death', content:[['p','Death by neurologic criteria, commonly called brain death, refers to the irreversible cessation of all functions of the entire brain, including the brainstem, when determined according to accepted medical standards. Machines and medications can support some body functions even when brain death has occurred.'],['p','This is a medical and legal topic with formal protocols. It is not the same as coma or a prolonged disorder of consciousness.']],quiz:{question:'Which statement best distinguishes brain death from coma?',options:['Brain death involves irreversible cessation of all brain functions, including the brainstem','Brain death is simply a very deep sleep','Coma and brain death always mean exactly the same thing','Brain death means only that memory has stopped'],correct:0,why:'Brain death refers to irreversible cessation of all functions of the entire brain, including the brainstem.'},terms:['death by neurologic criteria','brainstem','irreversible']}
    ]
  },
  {
    id:'career', title:'Your Neurosurgeon Roadmap', blurb:'Put the science together with school, research, communication, and lifelong learning.', level:'Capstone', time:'20 min',
    sections:[
      {title:'What to build now', content:[['p','At the beginning, your most valuable skills are broad: strong science, math, reading, writing, curiosity, and the ability to study consistently. You do not need to know medical school material now.'],['ul',['Learn anatomy and biology with real understanding.','Practice explaining complicated ideas simply.','Keep your general school subjects strong.','Read from trustworthy sources.','Protect your sleep, exercise, friendships, and ordinary childhood too.']]],callout:'A future surgeon needs a healthy, curious human brain before they need a gigantic vocabulary.',terms:['foundations','curiosity','communication']},
      {title:'The long U.S. path', content:[['p','A typical U.S. pathway includes secondary school, college, medical school, and residency training. Neurosurgery residency is typically seven years, and some surgeons complete additional fellowship training.'],['p','The exact timing and choices can change. Your job now is not to plan every year. Your job is to keep building the skills that keep future choices open.']],terms:['college','medical school','residency','fellowship']},
      {title:'Capstone checkpoint', content:[['p','You have now traveled from cells and action potentials to anatomy, pathways, disease, and the foundations of neurosurgery. This final checkpoint is about whether you can connect the subjects instead of treating them as separate flashcards.']],quiz:{question:'Which habit will help you most across a long neuroscience learning journey?',options:['Understand concepts and revisit them over time','Memorize every fact once','Only study when an exam is tomorrow','Skip the basics and jump to surgery'],correct:0,why:'Long term learning depends on strong foundations, understanding, retrieval, and repeated practice.'},terms:['lifelong learning','retrieval practice','foundation']}
    ]
  }
];

const glossaryTerms = [
  ['Action potential','A rapid, characteristic electrical signal in an excitable cell.'],['Axon','A neuronal process that commonly carries signals away from the cell body.'],['Brainstem','The midbrain, pons, and medulla; contains pathways and important neural circuits.'],['Cerebellum','A brain structure involved in coordination, balance, timing, and motor learning.'],['Cerebrum','The largest major division of the brain, involved in many higher level functions.'],['Dendrite','A neuronal process that commonly receives incoming signals.'],['Glia','Support cells of nervous tissue with many specialized functions.'],['Hippocampus','A structure important for memory formation and related learning processes.'],['Meninges','Protective connective tissue layers around the brain and spinal cord.'],['Myelin','An insulating layer around many axons.'],['Neuron','An electrically active cell specialized to receive and send information.'],['Neuroplasticity','The nervous system’s ability to change structure or function with experience and other conditions.'],['Neurotransmitter','A chemical signal released by neurons to communicate across synapses.'],['Refractory period','A period after an action potential when another action potential is harder or temporarily impossible to produce normally.'],['Synapse','A communication junction between a neuron and another cell.'],['Thalamus','A major relay and processing region for many sensory and motor signals.'],['Threshold','A membrane voltage level that can trigger an action potential under the relevant conditions.'],['Ventricle','A fluid filled space within the brain that is part of the ventricular system.']
];

const stages = [
  {name:'Foundations of Neuroscience', courseId:'foundations'}, {name:'Cells & Building Blocks', courseId:'cells'}, {name:'Neuron Anatomy', courseId:'neuron-anatomy'}, {name:'Resting Membrane Potential', courseId:'resting'}, {name:'Action Potentials', courseId:'action'}, {name:'Synapses & Neurotransmitters', courseId:'synapses'}, {name:'Spinal Cord & Reflexes', courseId:'spinal'}, {name:'Cranial Nerves', courseId:'cranial'}, {name:'Major Brain Anatomy', courseId:'brain'}, {name:'Brainstem & Cerebellum', courseId:'brainstem'}, {name:'Deep Brain Structures', courseId:'deep'}, {name:'Sensory & Motor Pathways', courseId:'pathways'}, {name:'Brain Blood Supply', courseId:'blood'}, {name:'Meninges & CSF', courseId:'meninges'}, {name:'Neuroplasticity & Memory', courseId:'plasticity'}, {name:'Sleep & Consciousness', courseId:'sleep'}, {name:'Neurological Disorders', courseId:'disorders'}, {name:'Clinical Reasoning', courseId:'clinical'}, {name:'Imaging & Neurosurgery Foundations', courseId:'imaging'}, {name:'Capstone: Neurosurgeon Roadmap', courseId:'career'}
];

const stageByCourse = Object.fromEntries(stages.map((s,i)=>[s.courseId,i]));
const curriculumList = document.getElementById('curriculumList');
const continueBtn = document.getElementById('continueBtn');
const openNextBtn = document.getElementById('openNextBtn');
const courseDialog = document.getElementById('courseDialog');
const closeDialog = document.getElementById('closeDialog');
const chapterNav = document.getElementById('chapterNav');
const readerTitle = document.getElementById('readerTitle');
const readerContent = document.getElementById('readerContent');
const readerCallout = document.getElementById('readerCallout');
const readerTerms = document.getElementById('readerTerms');
const readerQuiz = document.getElementById('readerQuiz');
const readerSectionCount = document.getElementById('readerSectionCount');
const chapterProgressBar = document.getElementById('chapterProgressBar');
const nextSectionBtn = document.getElementById('nextSection');
const prevSectionBtn = document.getElementById('prevSection');
const toast = document.getElementById('toast');

let activeCourseIndex = 0;
let activeSectionIndex = 0;
let activeQuizAnswered = false;
let quizTimer = null;

function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(()=>toast.classList.remove('show'),2600);
}

function currentStageIndex(){ return Math.min(state.unlocked, stages.length - 1); }
function courseForStage(index){ return courses[stageByCourse[stages[index].courseId]]; }
function isStageComplete(index){ return !!state.completed[stages[index].courseId]; }
function quizBest(index){ return Number(state.quizBest[stages[index].courseId] || 0); }

function updateDashboard(){
  const completedCount = stages.filter((_,i)=>isStageComplete(i)).length;
  const percent = Math.round((completedCount / stages.length) * 100);
  document.getElementById('progressText').textContent = `${percent}%`;
  document.getElementById('xpText').textContent = `${state.xp} XP`;
  document.getElementById('stageProgress').textContent = `${completedCount} / ${stages.length}`;
  const current = currentStageIndex();
  document.getElementById('currentStageName').textContent = stages[current].name;
  const bests = stages.map((_,i)=>quizBest(i));
  document.getElementById('quizBestText').textContent = bests.length ? `${Math.max(...bests)}%` : '0%';
  document.getElementById('badgeText').textContent = `${state.badges.length}`;
  const ring = document.querySelector('.dash-ring');
  if(ring) ring.style.setProperty('--ring', `${percent}%`);
  const next = currentStageIndex();
  const course = courseForStage(next);
  document.getElementById('nextLessonTitle').textContent = `Chapter ${String(next+1).padStart(2,'0')}: ${course.title}`;
  document.getElementById('nextLessonBlurb').textContent = course.blurb;
  const isDone = isStageComplete(next);
  document.getElementById('openNextBtn').textContent = isDone ? (next === stages.length - 1 ? 'Review capstone' : 'Review chapter') : 'Open chapter';
  renderCurriculum();
}

function renderCurriculum(){
  curriculumList.innerHTML='';
  stages.forEach((stage,i)=>{
    const unlocked = i <= state.unlocked;
    const complete = isStageComplete(i);
    const current = i === currentStageIndex();
    const card = document.createElement('article');
    card.className = `curriculum-card ${!unlocked?'locked':''} ${current?'current':''}`;
    card.innerHTML = `<div class="stage-index">${String(i+1).padStart(2,'0')}</div>
      <div class="stage-main"><h3>${stage.name}</h3><p>${courses[stageByCourse[stage.courseId]].blurb}</p><div class="stage-meta"><span class="stage-tag">${courses[stageByCourse[stage.courseId]].level}</span><span class="stage-tag">${courses[stageByCourse[stage.courseId]].time}</span></div></div>
      <div class="stage-status ${complete?'done':''} ${current&&!complete?'current':''}">${complete?'✓ Complete':unlocked?(current?'Current':'Unlocked'):'🔒 Locked'}</div>`;
    if(unlocked){
      const button=document.createElement('button');
      button.className='button secondary';
      button.textContent=complete?'Review':'Study';
      button.addEventListener('click',()=>openCourse(i));
      card.appendChild(button);
    }
    curriculumList.appendChild(card);
  });
}

function openCourse(index){
  if(index>state.unlocked){ showToast('Finish the earlier chapter first. One brain map at a time. 🧠'); return; }
  activeCourseIndex=index;
  activeSectionIndex=0;
  activeQuizAnswered=false;
  state.lastOpened=index;
  save();
  buildChapterNav();
  renderSection();
  if(typeof courseDialog.showModal==='function') courseDialog.showModal(); else courseDialog.setAttribute('open','');
}

function closeCourse(){ courseDialog.close(); clearTimeout(quizTimer); }
closeDialog.addEventListener('click',closeCourse);
courseDialog.addEventListener('click',(event)=>{ if(event.target===courseDialog) closeCourse(); });

function buildChapterNav(){
  const course=courseForStage(activeCourseIndex);
  document.getElementById('courseKicker').textContent=`STAGE ${String(activeCourseIndex+1).padStart(2,'0')} • ${course.level.toUpperCase()}`;
  document.getElementById('courseDialogTitle').textContent=course.title;
  chapterNav.innerHTML='';
  course.sections.forEach((section,i)=>{
    const b=document.createElement('button');
    b.className='toc-btn';
    b.innerHTML=`<span class="toc-num">${i+1}</span><span>${section.title}</span>`;
    b.addEventListener('click',()=>{
      activeSectionIndex=i;
      activeQuizAnswered=false;
      renderSection();
    });
    chapterNav.appendChild(b);
  });
}

function renderContentBlocks(blocks){
  readerContent.innerHTML='';
  blocks.forEach(block=>{
    const type=block[0];
    if(type==='p'){
      const p=document.createElement('p'); p.textContent=block[1]; readerContent.appendChild(p);
    } else if(type==='h4'){
      const h=document.createElement('h4'); h.textContent=block[1]; readerContent.appendChild(h);
    } else if(type==='ul'){
      const ul=document.createElement('ul');
      block[1].forEach(item=>{const li=document.createElement('li');li.textContent=item;ul.appendChild(li)});
      readerContent.appendChild(ul);
    } else if(type==='diagram'){
      const wrap=document.createElement('div'); wrap.className='reader-diagram';
      block[1].forEach(pair=>{const box=document.createElement('div');box.className='diagram-box';box.innerHTML=`<strong>${pair[0]}</strong><span>${pair[1]}</span>`;wrap.appendChild(box)});
      readerContent.appendChild(wrap);
    }
  });
}

function renderQuiz(quiz){
  readerQuiz.innerHTML='';
  if(!quiz){ readerQuiz.classList.add('hidden'); return; }
  readerQuiz.classList.remove('hidden');
  const title=document.createElement('h4'); title.textContent='🧪 Checkpoint quiz'; readerQuiz.appendChild(title);
  const question=document.createElement('div'); question.className='quiz-question'; question.textContent=quiz.question; readerQuiz.appendChild(question);
  const answers=document.createElement('div'); answers.className='quiz-answers'; readerQuiz.appendChild(answers);
  const feedback=document.createElement('div'); feedback.className='quiz-feedback'; feedback.id='activeQuizFeedback'; readerQuiz.appendChild(feedback);
  const score=document.createElement('div'); score.className='quiz-score'; score.textContent='Pass mark: 70%. You only get one checkpoint question per section.'; readerQuiz.appendChild(score);
  quiz.options.forEach((option,index)=>{
    const btn=document.createElement('button'); btn.className='quiz-option'; btn.textContent=option;
    btn.addEventListener('click',()=>answerQuiz(index,btn,quiz,answers,feedback));
    answers.appendChild(btn);
  });
}

function answerQuiz(index,clicked,quiz,answers,feedback){
  if(activeQuizAnswered) return;
  activeQuizAnswered=true;
  [...answers.children].forEach((button,i)=>{button.disabled=true;if(i===quiz.correct)button.classList.add('correct')});
  if(index===quiz.correct){
    clicked.classList.add('correct');
    feedback.innerHTML=`<strong>Correct.</strong> ${quiz.why}`;
    awardQuizXP();
    maybeUnlockCurrentCourse();
  } else {
    clicked.classList.add('incorrect');
    feedback.innerHTML=`<strong>Not quite.</strong> ${quiz.why}`;
  }
}

function awardQuizXP(){
  state.xp += 25;
  save();
  updateDashboard();
  showToast('+25 XP; checkpoint cleared! ⚡');
}

function maybeUnlockCurrentCourse(){
  const course=courseForStage(activeCourseIndex);
  const stage=stages[activeCourseIndex];
  state.quizBest[course.id]=Math.max(quizBest(activeCourseIndex),100);
  state.completed[course.id]=true;
  if(activeCourseIndex>=state.unlocked && activeCourseIndex<stages.length-1) state.unlocked=activeCourseIndex+1;
  if(!state.badges.includes(course.id)) state.badges.push(course.id);
  save();
  updateDashboard();
  showToast(`Stage ${activeCourseIndex+1} complete! The next stage is unlocked. 🎓`);
  if(activeCourseIndex < stages.length-1){
    nextSectionBtn.textContent='Preparing next stage…';
    clearTimeout(quizTimer);
    quizTimer=setTimeout(()=>{
      const next=activeCourseIndex+1;
      closeCourse();
      setTimeout(()=>openCourse(next),220);
    },1800);
  } else {
    nextSectionBtn.textContent='Journey complete 🎉';
  }
}

function renderSection(){
  const course=courseForStage(activeCourseIndex);
  const section=course.sections[activeSectionIndex];
  document.getElementById('readerType').textContent=course.lab && activeSectionIndex===0?'TEXTBOOK + LAB':'TEXTBOOK CHAPTER';
  readerSectionCount.textContent=`Section ${activeSectionIndex+1} of ${course.sections.length}`;
  readerTitle.textContent=section.title;
  renderContentBlocks(section.content);
  if(section.callout){ readerCallout.className=`reader-callout ${section.quiz?'warning':''}`; readerCallout.textContent=section.callout; readerCallout.classList.remove('hidden'); } else { readerCallout.classList.add('hidden'); }
  readerTerms.innerHTML='';
  (section.terms||[]).forEach(term=>{const span=document.createElement('span');span.className='reader-term';span.textContent=term;readerTerms.appendChild(span)});
  activeQuizAnswered=false;
  renderQuiz(section.quiz);
  chapterNav.querySelectorAll('.toc-btn').forEach((b,i)=>{b.classList.toggle('active',i===activeSectionIndex);b.classList.toggle('done',i<activeSectionIndex||isStageComplete(activeCourseIndex))});
  prevSectionBtn.disabled=activeSectionIndex===0;
  nextSectionBtn.textContent=activeSectionIndex===course.sections.length-1?(isStageComplete(activeCourseIndex)?(activeCourseIndex<stages.length-1?'Next stage →':'Finish'):(section.quiz?'Complete checkpoint':'Finish chapter')):'Next section';
  chapterProgressBar.style.width=`${((activeSectionIndex+1)/course.sections.length)*100}%`;
  if(course.id==='action' && activeSectionIndex===0) injectLabMiniPrompt();
}

function injectLabMiniPrompt(){
  const note=document.createElement('div');
  note.className='reader-callout';
  note.textContent='⚡ After this section, jump to the Action Potential Lab below the textbook. Drag the slider and explain each stage in your own words.';
  readerContent.appendChild(note);
}

function nextSection(){
  const course=courseForStage(activeCourseIndex);
  const section=course.sections[activeSectionIndex];
  if(activeSectionIndex < course.sections.length-1){
    activeSectionIndex++;
    renderSection();
    return;
  }
  if(section.quiz && !activeQuizAnswered){
    showToast('Take the checkpoint quiz before moving on. 🧪');
    return;
  }
  if(!section.quiz && !isStageComplete(activeCourseIndex)){
    state.completed[course.id]=true;
    state.quizBest[course.id]=0;
    state.xp += 10;
    if(activeCourseIndex===state.unlocked && activeCourseIndex<stages.length-1) state.unlocked=activeCourseIndex+1;
    if(!state.badges.includes(course.id)) state.badges.push(course.id);
    save(); updateDashboard();
    showToast(`Chapter ${activeCourseIndex+1} complete. +10 XP 📖`);
    if(activeCourseIndex<stages.length-1){
      clearTimeout(quizTimer);
      quizTimer=setTimeout(()=>{closeCourse();setTimeout(()=>openCourse(activeCourseIndex+1),220)},1200);
    }
    return;
  }
  if(activeCourseIndex < stages.length-1){ closeCourse(); setTimeout(()=>openCourse(activeCourseIndex+1),180); }
}

prevSectionBtn.addEventListener('click',()=>{if(activeSectionIndex>0){activeSectionIndex--;renderSection()}});
nextSectionBtn.addEventListener('click',nextSection);
continueBtn.addEventListener('click',()=>openCourse(currentStageIndex()));
openNextBtn.addEventListener('click',()=>openCourse(currentStageIndex()));

document.getElementById('resetProgress').addEventListener('click',()=>{
  if(!confirm('Reset all NeuroPath progress?')) return;
  state={...defaultState,completed:{},quizBest:{},badges:[]};
  save(); updateDashboard(); showToast('Progress reset. Fresh notebook. 🧠');
});

const stagesLab=[
  {title:'Resting potential',voltage:'−70 mV',description:'The neuron is at rest and maintains ion gradients across its membrane.',ion:'Think: stable gradients + selective permeability',prompt:'Why is the membrane voltage not zero at rest?'},
  {title:'Threshold',voltage:'about −55 mV',description:'A sufficient voltage change can bring the membrane to threshold and trigger a regenerative action potential.',ion:'Think: threshold → many voltage gated Na⁺ channels open',prompt:'Why does reaching threshold matter?'},
  {title:'Depolarization',voltage:'rising toward +30 mV',description:'Sodium ions move inward through open voltage gated sodium channels, making the membrane rapidly more positive.',ion:'Think: Na⁺ influx dominates the rising phase',prompt:'Which ion is especially important during the rising phase?'},
  {title:'Peak',voltage:'about +30 mV',description:'The membrane reaches a positive peak as sodium channels inactivate and potassium conductance becomes important.',ion:'Think: Na⁺ channels inactivate + K⁺ channels activate',prompt:'Why does the voltage stop rising?'},
  {title:'Repolarization',voltage:'falling toward rest',description:'Potassium ions move outward through open potassium channels, helping return the membrane toward negative values.',ion:'Think: K⁺ efflux helps bring voltage down',prompt:'Which ion movement helps the falling phase?'},
  {title:'Hyperpolarization',voltage:'below resting level',description:'Potassium conductance can remain elevated briefly, making the membrane more negative than resting level.',ion:'Think: a temporary overshoot below rest',prompt:'Why can the membrane become more negative than rest?'},
  {title:'Recovery',voltage:'returning toward rest',description:'Channel states and ion gradients settle back toward the conditions that support another signal.',ion:'Think: channels reset + gradients are maintained',prompt:'What has to reset before another signal can occur normally?'}
];
const slider=document.getElementById('potentialSlider');
const stageButtons=document.getElementById('stageButtons');
stagesLab.forEach((stage,index)=>{const b=document.createElement('button');b.textContent=stage.title;b.addEventListener('click',()=>{slider.value=index;renderLabStage(index)});stageButtons.appendChild(b)});
function renderLabStage(index){const s=stagesLab[index];document.getElementById('voltageLabel').textContent=s.voltage;document.getElementById('stageTitle').textContent=s.title;document.getElementById('stageDescription').textContent=s.description;document.getElementById('ionBox').textContent=s.ion;document.getElementById('teachPrompt').textContent=s.prompt;stageButtons.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('active',i===index))}
slider.addEventListener('input',()=>renderLabStage(Number(slider.value)));renderLabStage(0);

function renderGlossary(query=''){
  const host=document.getElementById('glossary');
  const q=query.trim().toLowerCase();host.innerHTML='';
  glossaryTerms.filter(([term,def])=>!q||`${term} ${def}`.toLowerCase().includes(q)).forEach(([term,def])=>{const item=document.createElement('article');item.className='glossary-item';const h=document.createElement('h3');h.textContent=term;const p=document.createElement('p');p.textContent=def;item.append(h,p);host.appendChild(item)});
}
document.getElementById('glossarySearch').addEventListener('input',(e)=>renderGlossary(e.target.value));
renderGlossary();
updateDashboard();
