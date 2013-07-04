import re
import sys

class Exporter():

	def __init__(self, inputfile , outputdir):
		self.file = inputfile
		self.out = outputdir
		self.name = ""
		self.outname = ""
		self.parseFile()


	def parseFile(self):
		inp = open(self.file, "r")
		data = inp.read();
		r = re.compile('//BehaviorName(.*)//BehaviorLocals(.*)//BehaviorFunctions(.*)' ,re.DOTALL)
		res  = r.findall(data)
		inp.close()
		self.outputFile(res[0][0].strip(),res[0][1].strip(),res[0][2].strip())

	def outputFile(self, name, locals, funs):
		self.out = self.out if (self.out.endswith("/")) else self.out+"/"
		outname = name+"Behavior";
		self.name = name
		self.outname = outname
		f=open(outname+".js", "w")
		try:	
			
			f.write("Jasper."+outname+" = function()");
			for line in locals.split("\n"):
				line = line.strip()
				if(line is not ""):
					if not (line.startswith("{") or line.startswith("}")):
						line = "this."+line
						line = line[:-1]+";" if (line.endswith(","))  else line+";"
						line = " = ".join(line.split(":",1))

						f.write(line+"\n")
					else:
						f.write(line + "\n")
			f.write("; \n \n \
Jasper."+outname+".prototype = new Jasper.Behavior(); \n \n \
Object.extend(Jasper."+outname+".prototype, "+funs+");")
			f.close()
		except BaseException:
			f.close()
			raise()
			




if __name__=="__main__":
	if (len(sys.argv) is 3):
		export = Exporter(sys.argv[1], sys.argv[2])
		print "\nSuccessfully created "+export.outname+".js! \nNow in your game, include this .js file and also include this command :\n\
<yourJasper.CoreObject>.registerBehavior(\""+export.name+"\", Jasper."+export.outname+")\n\n\
You can now use the behavior in your game with the syntax\n\
<Jasper.Object>.addBehavior(\""+export.name+"\");\n"
	else:
		print "Usage: python exporter.py <inputfile> <outputdir>"
	

