.PHONY: install
install:
	helm install bottle-search .
.PHONY: uninstall
uninstall:
	helm uninstall bottle-search

